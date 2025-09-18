import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'
import { Button, Title, Input, Label, Card } from '../../components/ui'
import { BrandLogo } from '../../components/brand/BrandLogo'
import { useAuthStore } from '../../store/authStore'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
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

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      navigate('/dashboard')
    },
    onError: () => {
      toast.error(t('common.error'))
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
      toast.error(t('auth.signInFailed'))
    },
  })

  const validateForm = () => {
    const newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = t('auth.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid')
    }

    if (!password) {
      newErrors.password = t('auth.passwordRequired')
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
    <div className="bg-bg-soft flex min-h-screen">
      {/* Left Panel - Brand */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="from-brand to-accent absolute inset-0 bg-gradient-to-br"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <BrandLogo size="lg" className="mb-12 text-white" />

            <h2 className="font-display mb-8 text-3xl font-bold">
              Welcome to the future of restaurant management
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-white/90" />
                <span className="text-white/90">
                  Real-time dashboards and analytics
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-white/90" />
                <span className="text-white/90">
                  Kitchen & POS perfectly in sync
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-white/90" />
                <span className="text-white/90">
                  AI-driven insights and campaigns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <BrandLogo size="md" className="mx-auto mb-6" />
          </div>

          <Card className="p-8">
            <div className="mb-8 text-center">
              <Title level={2} className="mb-2">
                Sign in to your account
              </Title>
              <p className="text-ink/60">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              aria-live="polite"
            >
              <div>
                <Label htmlFor="email" required>
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  error={!!errors.email}
                  helperText={errors.email}
                  aria-invalid={!!errors.email}
                />
              </div>

              <div>
                <Label htmlFor="password" required>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  error={!!errors.password}
                  helperText={errors.password}
                  aria-invalid={!!errors.password}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Sign in
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  disabled={true}
                >
                  Continue with Google (Coming soon)
                </Button>
              </div>
            </form>

            <div className="text-ink/60 mt-8 text-center text-sm">
              By signing in, you agree to our{' '}
              <a href="#" className="text-brand hover:text-brand/80 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand hover:text-brand/80 underline">
                Privacy Policy
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
