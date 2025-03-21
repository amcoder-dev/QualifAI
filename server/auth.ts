import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { RequestHandler } from "express"

let supabase: SupabaseClient
export const initAuth = () => {
  supabase = createClient(
    "https://ittrwlucyrfaqaewpoic.supabase.co",
    // Supabase anonymous key :)
    process.env.SUPABASE_API_KEY || ""
  )
}

export const checkAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization || ""
  if (!authorization.startsWith("Bearer ")) {
    console.error("Authorization header invalid.")
    res.status(401).json({ error: "Missing authorization header" })
    return
  }
  const token = authorization.substring("Bearer ".length)
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) {
    console.error("Supabase auth failed.")
    res.status(401).json({ error: "Invalid authorization header" })
    return
  }
  next()
}
