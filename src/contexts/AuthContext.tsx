import React, { createContext, useState, ReactNode, useEffect } from "react"
import { AuthContextType } from "../types"
import { createClient, Session } from "@supabase/supabase-js"

const supabase = createClient(
  "https://ittrwlucyrfaqaewpoic.supabase.co",
  // Supabase anonymous key :)
  import.meta.env.VITE_SUPABASE_ANONYMOUS_KEY
)

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
})

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthContextType["user"]>(null)

  const handleSessionChange = (session: Session | null) => {
    if (session) {
      setIsAuthenticated(true)
      setUser({
        email: session.user.email || "Anonymous User",
        accessToken: session.access_token,
      })
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleSessionChange(session))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      handleSessionChange(session)
    )

    return () => subscription.unsubscribe()
  })

  const login = (email: string, password: string) =>
    supabase.auth.signInWithPassword({
      email,
      password,
    })

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
