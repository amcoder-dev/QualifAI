import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import axios from "https://esm.sh/axios@1.8.4"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { JigsawStack } from "https://esm.sh/jigsawstack@0.0.28"
import { calculateAISearchRelevantScorePrompt } from "./prompt.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

interface AISearchData {
  overview: string
  relevanceScore: number
  websiteURL: string
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
    const searchResult = await aiSearchRequest(jigsawStack, leadData.name)
    
    // Update lead data
    await supabase
      .from("leads")
      .update({
        osi_relevance: searchResult.relevanceScore,
        osi_company_website: searchResult.websiteURL,
        osi_overview: searchResult.overview,
      })
      .eq("id", lead_id)

    return new Response(
      JSON.stringify({
        overview:
        searchResult.overview || `Information about ${leadData.name}`,
        relevanceScore: searchResult.relevanceScore,
        websiteURL: searchResult.websiteURL,
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

 const aiSearchRequest = async (jigsawStack: ReturnType<typeof JigsawStack>, query: string): Promise<AISearchData> => {
  console.log("Performing AI search for:", query)
  try {
    type SearchResponse = ReturnType<
      ReturnType<typeof JigsawStack>["web"]["search"]
    >
    const searchResponse = await Promise.race([
      jigsawStack.web.search({
        query,
        ai_overview: true,
        safe_search: "moderate",
        spell_check: true,
      }),
      new Promise<SearchResponse>((_, reject) =>
        setTimeout(() => reject(new Error("Search timeout")), 15000)
      ),
    ])

    console.log("Search response received")

    if (!searchResponse || !searchResponse.success) {
      console.error("Search failed or returned invalid response")
      return {
        overview: "Search failed to return results.",
        relevanceScore: 0.5,
        websiteURL: "",
      }
    }

    let snippets = ""
    try {
      snippets = (searchResponse.results || [])
        .map((result) => result.snippets || [])
        .flat()
        .slice(0, 5) // Get top 5 snippets
        .join("\n\n")

      console.log("Extracted snippets")
    } catch (e) {
      console.error("Error extracting snippets:", e)
      snippets = "No snippets available"
    }

    let relevanceScore = 0.5 // Default value
    try {
      const modifiedPrompt = calculateAISearchRelevantScorePrompt.replace(
        "webSnippets: [",
        `webSnippets: [\n"${snippets}",`
      )

      const relevanceResponse = await sendPrompt(modifiedPrompt)
      console.log("Relevance response received")

      // Extract Relevance Score
      if (relevanceResponse) {
        const cleanJson = jsonClean(relevanceResponse)
        if (cleanJson) {
          try {
            const parsed = JSON.parse(cleanJson)
            if (typeof parsed.relevanceScore === "number") {
              relevanceScore = parsed.relevanceScore
            }
          } catch (parseError) {
            console.error("JSON parse error:", parseError)
            // Try to extract a number if JSON parsing fails
            const numberMatch = relevanceResponse.match(/([0-9]*\.?[0-9]+)/)
            if (numberMatch && numberMatch[0]) {
              const extractedNumber = parseFloat(numberMatch[0])
              if (
                !isNaN(extractedNumber) &&
                extractedNumber >= 0 &&
                extractedNumber <= 1
              ) {
                relevanceScore = extractedNumber
              }
            }
          }
        }
      }

      console.log("Final relevance score:", relevanceScore)
    } catch (e) {
      console.error("Error calculating relevance score:", e)
      // Continue with default score
    }

    return {
      overview: searchResponse.ai_overview || "Information about " + query,
      relevanceScore,
      websiteURL: searchResponse.results[0].url,
    }
  } catch (error) {
    console.error("Error with AI Search:", error)
    // Return fallback data instead of throwing
    return {
      overview: "Information unavailable.",
      relevanceScore: 0.5,
      websiteURL: "",
    }
  }
}

const sendPrompt = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Sending prompt to OpenAI")
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data.choices[0].message.content
  } catch (error) {
    console.error("Error with OpenAI API:", error.message)
    return null
  }
}

const jsonClean = (str: string | null) =>
  str?.replace("```json", "")?.replace("```", "")