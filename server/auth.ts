import { RequestHandler } from "express"
import { initSupabase } from "./supabaseClient"

export const checkAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization || ""
  if (!authorization.startsWith("Bearer ")) {
    console.error("Authorization header invalid.")
    res.status(401).json({ error: "Missing authorization header" })
    return
  }
  
  const token = authorization.substring("Bearer ".length)
  
  try {
    const supabase = initSupabase()
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error || !data.user) {
      console.error("Supabase auth failed:", error)
      res.status(401).json({ error: "Invalid authorization header" })
      return
    }
    
    // Add user info to request for later use
    req.user = data.user
    next()
  } catch (e) {
    console.error("Error in auth check:", e)
    res.status(500).json({ error: "Authentication service unavailable" })
  }
}

// Add type declaration to augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}