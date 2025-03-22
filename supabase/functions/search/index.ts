import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { JigsawStack } from "https://esm.sh/jigsawstack@0.0.28"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Verify auth
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Get request body
    const { lead_id } = await req.json()
    if (!lead_id || typeof lead_id !== "number") {
      return new Response(
        JSON.stringify({ error: "Valid lead_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Get lead data
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select()
      .eq("id", lead_id)
      .single()

    if (leadError || !leadData) {
      return new Response(JSON.stringify({ error: "Lead not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Initialize JigsawStack
    const jigsawStack = JigsawStack({
      apiKey: Deno.env.get("JIGSAW_API_KEY"),
    })

    // Perform search
    const searchResponse = await jigsawStack.web.search({
      query: leadData.name,
      ai_overview: true,
      safe_search: "moderate",
      spell_check: true,
    })

    if (!searchResponse.success) {
      throw new Error("Search failed")
    }

    // Update lead data
    await supabase
      .from("leads")
      .update({
        osi_relevance: searchResponse.results[0]?.relevance ?? 0.5,
        osi_company_website: searchResponse.results[0]?.url,
        osi_overview: searchResponse.ai_overview,
      })
      .eq("id", lead_id)

    return new Response(
      JSON.stringify({
        overview:
          searchResponse.ai_overview || `Information about ${leadData.name}`,
        relevanceScore: searchResponse.results[0]?.relevance ?? 0.5,
        websiteURL: searchResponse.results[0]?.url || "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
