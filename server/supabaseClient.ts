import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Ensure environment variables are loaded
dotenv.config()

// Initialize supabase client
let supabase: SupabaseClient | null = null

export const initSupabase = () => {
  if (!supabase) {
    const supabaseUrl = "https://ittrwlucyrfaqaewpoic.supabase.co"
    const supabaseKey = process.env.SUPABASE_API_KEY

    if (!supabaseKey) {
      console.error("SUPABASE_API_KEY not found in environment variables")
      throw new Error("SUPABASE_API_KEY is required")
    }

    supabase = createClient(supabaseUrl, supabaseKey)
    console.log("Supabase client initialized successfully")
  }

  return supabase
}

