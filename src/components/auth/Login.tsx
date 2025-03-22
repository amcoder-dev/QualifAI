import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Mail,
  Lock,
  X,
  Activity,
  FileAudio,
  Star,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-[#F2F2F7] p-3 rounded-xl">
                <LayoutGrid className="w-12 h-12 text-[#403DA1]" />
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white"
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white"
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
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
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
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#403DA1] to-[#AA55B9] hover:from-[#373490] hover:to-[#954AA3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#403DA1] transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg shadow-md"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="w-1/2 bg-gradient-to-br from-[#403DA1] via-[#7349AD] to-[#AA55B9] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-[#e7c6ff] opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[#AA55B9] opacity-20 blur-3xl"></div>
          <div className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full bg-[#403DA1] opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-[#F2F2F7] opacity-20 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-[#AA55B9] opacity-20 blur-3xl"></div>
        </div>
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute right-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute left-2/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute left-0 bottom-1/3 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="max-w-md text-white relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-[#e7c6ff] to-white rounded-full"></div>
            <span className="text-white text-opacity-90 text-sm font-medium tracking-wider">ANALYTICS DASHBOARD</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Transform Your <span className="bg-gradient-to-r from-[#e7c6ff] to-white bg-clip-text text-transparent">Sales Process</span> With AI
          </h2>
          
          <div className="space-y-6 mt-8">
            <div className="bg-white bg-opacity-15 p-5 rounded-2xl backdrop-blur-md border border-white border-opacity-20 transition-all duration-300 hover:bg-opacity-20 hover:scale-[1.02] hover:shadow-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#403DA1] to-[#AA55B9] p-3 rounded-xl shadow-lg transform transition-all duration-300 hover:rotate-3 hover:scale-110">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI-Powered Analytics</h3>
                  <p className="text-white text-opacity-90">
                    Get deep insights into customer interactions with advanced
                    sentiment analysis and predictive modeling
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20 transition-all duration-300 hover:bg-opacity-15 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
                  <FileAudio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Smart Call Recording</h3>
                  <p className="text-white text-opacity-80">
                    Automatically capture and analyze sales calls for better
                    performance and coaching opportunities
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20 transition-all duration-300 hover:bg-opacity-15 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Lead Scoring</h3>
                  <p className="text-white text-opacity-80">
                    Prioritize your leads with intelligent scoring based on real
                    interactions and engagement metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-between items-center">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#e7c6ff] border-2 border-white flex items-center justify-center text-[#403DA1] font-bold text-xs shadow-lg">JD</div>
              <div className="w-12 h-12 rounded-full bg-[#F2F2F7] border-2 border-white flex items-center justify-center text-[#AA55B9] font-bold text-xs shadow-lg">LM</div>
              <div className="w-12 h-12 rounded-full bg-[#AA55B9] border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg">RK</div>
              <div className="w-12 h-12 rounded-full bg-[#403DA1] border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg">+5</div>
            </div>
            <div className="text-white text-opacity-90 text-sm font-medium bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
              Join 2,000+ sales teams using our platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};