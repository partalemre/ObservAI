import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
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
export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const { setContext } = useOrgStore()
  const meMutation = useMutation({
    mutationFn: async () => {
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
    mutationFn: async (data) => {
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
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      loginMutation.mutate({ email, password })
    }
  }
  const isLoading = loginMutation.isPending || meMutation.isPending
  return _jsxs('div', {
    className: 'bg-bg-soft flex min-h-screen',
    children: [
      _jsxs('div', {
        className: 'relative hidden overflow-hidden lg:flex lg:w-1/2',
        children: [
          _jsx('div', {
            className:
              'from-brand to-accent absolute inset-0 bg-gradient-to-br',
          }),
          _jsx('div', {
            className:
              'relative z-10 flex flex-col items-center justify-center p-12 text-white',
            children: _jsxs('div', {
              className: 'max-w-md',
              children: [
                _jsx(BrandLogo, { size: 'lg', className: 'mb-12 text-white' }),
                _jsx('h2', {
                  className: 'font-display mb-8 text-3xl font-bold',
                  children: 'Welcome to the future of restaurant management',
                }),
                _jsxs('div', {
                  className: 'space-y-6',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'h-6 w-6 flex-shrink-0 text-white/90',
                        }),
                        _jsx('span', {
                          className: 'text-white/90',
                          children: 'Real-time dashboards and analytics',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'h-6 w-6 flex-shrink-0 text-white/90',
                        }),
                        _jsx('span', {
                          className: 'text-white/90',
                          children: 'Kitchen & POS perfectly in sync',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'h-6 w-6 flex-shrink-0 text-white/90',
                        }),
                        _jsx('span', {
                          className: 'text-white/90',
                          children: 'AI-driven insights and campaigns',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex flex-1 items-center justify-center p-8',
        children: _jsxs('div', {
          className: 'w-full max-w-md',
          children: [
            _jsx('div', {
              className: 'mb-8 text-center lg:hidden',
              children: _jsx(BrandLogo, {
                size: 'md',
                className: 'mx-auto mb-6',
              }),
            }),
            _jsxs(Card, {
              className: 'p-8',
              children: [
                _jsxs('div', {
                  className: 'mb-8 text-center',
                  children: [
                    _jsx(Title, {
                      level: 2,
                      className: 'mb-2',
                      children: 'Sign in to your account',
                    }),
                    _jsx('p', {
                      className: 'text-ink/60',
                      children:
                        'Enter your credentials to access your dashboard',
                    }),
                  ],
                }),
                _jsxs('form', {
                  className: 'space-y-6',
                  onSubmit: handleSubmit,
                  'aria-live': 'polite',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx(Label, {
                          htmlFor: 'email',
                          required: true,
                          children: 'Email address',
                        }),
                        _jsx(Input, {
                          id: 'email',
                          name: 'email',
                          type: 'email',
                          autoComplete: 'email',
                          value: email,
                          onChange: (e) => setEmail(e.target.value),
                          placeholder: 'example@email.com',
                          error: !!errors.email,
                          helperText: errors.email,
                          'aria-invalid': !!errors.email,
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx(Label, {
                          htmlFor: 'password',
                          required: true,
                          children: 'Password',
                        }),
                        _jsx(Input, {
                          id: 'password',
                          name: 'password',
                          type: 'password',
                          autoComplete: 'current-password',
                          value: password,
                          onChange: (e) => setPassword(e.target.value),
                          placeholder: 'Enter your password',
                          error: !!errors.password,
                          helperText: errors.password,
                          'aria-invalid': !!errors.password,
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        _jsx(Button, {
                          type: 'submit',
                          loading: isLoading,
                          className: 'w-full',
                          size: 'lg',
                          children: 'Sign in',
                        }),
                        _jsx(Button, {
                          type: 'button',
                          variant: 'secondary',
                          className: 'w-full',
                          size: 'lg',
                          disabled: true,
                          children: 'Continue with Google (Coming soon)',
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'text-ink/60 mt-8 text-center text-sm',
                  children: [
                    'By signing in, you agree to our',
                    ' ',
                    _jsx('a', {
                      href: '#',
                      className: 'text-brand hover:text-brand/80 underline',
                      children: 'Terms of Service',
                    }),
                    ' ',
                    'and',
                    ' ',
                    _jsx('a', {
                      href: '#',
                      className: 'text-brand hover:text-brand/80 underline',
                      children: 'Privacy Policy',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  })
}
