import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutGrid,
  Mail,
  Lock,
  X,
  Activity,
  FileAudio,
  Star,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

export const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/"
    navigate(from)
    return <></>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      const from = (location.state as any)?.from?.pathname || "/"
      navigate(from)
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <LayoutGrid className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <X className="w-5 h-5" />
                {error}
              </div>
            )}
            <div className="rounded-xl shadow-sm -space-y-px bg-gray-50 p-4">
              <div className="mb-4">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="w-1/2 bg-indigo-600 flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            Transform Your Sales Process
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Analytics</h3>
                <p className="text-indigo-200">
                  Get deep insights into customer interactions with advanced
                  sentiment analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <FileAudio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Call Recording</h3>
                <p className="text-indigo-200">
                  Automatically capture and analyze sales calls for better
                  performance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lead Scoring</h3>
                <p className="text-indigo-200">
                  Prioritize your leads with intelligent scoring based on real
                  interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
