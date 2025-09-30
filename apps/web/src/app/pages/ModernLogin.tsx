import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useOrgStore } from '../../store/orgStore'
import api from '../../lib/api'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

interface MeResponse {
  user: {
    id: string
    email: string
    name: string
    roles: string[]
  }
  orgs: Array<{
    id: string
    name: string
  }>
  stores: Array<{
    id: string
    name: string
    orgId: string
  }>
}

const ModernLogin: React.FC = () => {
  const [email, setEmail] = useState('demo@obs.ai')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const { setContext } = useOrgStore()

  const meMutation = useMutation({
    mutationFn: async (): Promise<MeResponse> => {
      const response = await api.get('/me')
      return response.data
    },
    onSuccess: (data) => {
      setUser(data.user)
      setContext({
        orgs: data.orgs,
        stores: data.stores,
        selectedStoreId: data.stores[0]?.id || null,
      })
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Failed to load user data')
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      setToken(data.token)
      meMutation.mutate()
    },
    onError: () => {
      toast.error('Sign-in failed. Please check your credentials.')
    },
  })

  const validateForm = () => {
    const newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      loginMutation.mutate({ email, password })
    }
  }

  const isLoading = loginMutation.isPending || meMutation.isPending

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col items-start justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">ObservAI</h1>
            </div>

            <h2 className="mb-6 text-4xl leading-tight font-bold">
              Welcome to the future of
              <br />
              restaurant management
            </h2>

            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <span className="text-lg">
                  Real-time dashboards and analytics
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <span className="text-lg">Kitchen & POS perfectly in sync</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <span className="text-lg">
                  AI-driven insights and campaigns
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ObservAI</h1>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                  } focus:ring-2 focus:outline-none`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } focus:ring-2 focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Demo Credentials Info */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: demo@obs.ai
                  <br />
                  Password: Any password works
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:bg-indigo-400"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Links */}
              <div className="space-y-2 text-center">
                <a
                  href="#"
                  className="text-sm text-indigo-600 transition-colors hover:text-indigo-800"
                >
                  Forgot your password?
                </a>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <a href="#" className="transition-colors hover:text-gray-700">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="#" className="transition-colors hover:text-gray-700">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernLogin
