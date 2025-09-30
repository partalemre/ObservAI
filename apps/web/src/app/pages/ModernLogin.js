import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useOrgStore } from '../../store/orgStore'
import api from '../../lib/api'
const ModernLogin = () => {
  const [email, setEmail] = useState('demo@obs.ai')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
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
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Failed to load user data')
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
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      loginMutation.mutate({ email, password })
    }
  }
  const isLoading = loginMutation.isPending || meMutation.isPending
  return _jsxs('div', {
    className: 'min-h-screen flex',
    children: [
      _jsxs('div', {
        className:
          'hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden',
        children: [
          _jsx('div', { className: 'absolute inset-0 bg-black/20' }),
          _jsx('div', {
            className:
              'relative z-10 flex flex-col justify-center items-start p-12 text-white',
            children: _jsxs(motion.div, {
              initial: { opacity: 0, x: -50 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.8 },
              children: [
                _jsxs('div', {
                  className: 'flex items-center gap-3 mb-8',
                  children: [
                    _jsx('div', {
                      className:
                        'w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center',
                      children: _jsx('svg', {
                        className: 'w-8 h-8',
                        viewBox: '0 0 24 24',
                        fill: 'currentColor',
                        children: _jsx('path', {
                          d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                        }),
                      }),
                    }),
                    _jsx('h1', {
                      className: 'text-3xl font-bold',
                      children: 'ObservAI',
                    }),
                  ],
                }),
                _jsxs('h2', {
                  className: 'text-4xl font-bold mb-6 leading-tight',
                  children: [
                    'Welcome to the future of',
                    _jsx('br', {}),
                    'restaurant management',
                  ],
                }),
                _jsxs('div', {
                  className: 'space-y-4 mb-8',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'w-6 h-6 text-green-300',
                        }),
                        _jsx('span', {
                          className: 'text-lg',
                          children: 'Real-time dashboards and analytics',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'w-6 h-6 text-green-300',
                        }),
                        _jsx('span', {
                          className: 'text-lg',
                          children: 'Kitchen & POS perfectly in sync',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        _jsx(CheckCircle, {
                          className: 'w-6 h-6 text-green-300',
                        }),
                        _jsx('span', {
                          className: 'text-lg',
                          children: 'AI-driven insights and campaigns',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsx('div', {
            className:
              'absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl',
          }),
          _jsx('div', {
            className:
              'absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-2xl',
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex-1 flex items-center justify-center p-8 bg-gray-50',
        children: _jsxs(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: 'w-full max-w-md',
          children: [
            _jsx('div', {
              className: 'lg:hidden text-center mb-8',
              children: _jsxs('div', {
                className: 'inline-flex items-center gap-3 mb-4',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center',
                    children: _jsx('svg', {
                      className: 'w-6 h-6 text-white',
                      viewBox: '0 0 24 24',
                      fill: 'currentColor',
                      children: _jsx('path', {
                        d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                      }),
                    }),
                  }),
                  _jsx('h1', {
                    className: 'text-2xl font-bold text-gray-900',
                    children: 'ObservAI',
                  }),
                ],
              }),
            }),
            _jsxs('div', {
              className: 'bg-white rounded-2xl shadow-xl p-8',
              children: [
                _jsxs('div', {
                  className: 'text-center mb-8',
                  children: [
                    _jsx('h2', {
                      className: 'text-2xl font-bold text-gray-900 mb-2',
                      children: 'Sign in to your account',
                    }),
                    _jsx('p', {
                      className: 'text-gray-600',
                      children:
                        'Enter your credentials to access your dashboard',
                    }),
                  ],
                }),
                _jsxs('form', {
                  onSubmit: handleSubmit,
                  className: 'space-y-6',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('label', {
                          htmlFor: 'email',
                          className:
                            'block text-sm font-medium text-gray-700 mb-2',
                          children: 'Email address *',
                        }),
                        _jsx('input', {
                          id: 'email',
                          name: 'email',
                          type: 'email',
                          autoComplete: 'email',
                          value: email,
                          onChange: (e) => setEmail(e.target.value),
                          placeholder: 'example@email.com',
                          className: `w-full px-4 py-3 rounded-lg border transition-colors ${
                            errors.email
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                          } focus:outline-none focus:ring-2`,
                        }),
                        errors.email &&
                          _jsx('p', {
                            className: 'mt-1 text-sm text-red-600',
                            children: errors.email,
                          }),
                      ],
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('label', {
                          htmlFor: 'password',
                          className:
                            'block text-sm font-medium text-gray-700 mb-2',
                          children: 'Password *',
                        }),
                        _jsxs('div', {
                          className: 'relative',
                          children: [
                            _jsx('input', {
                              id: 'password',
                              name: 'password',
                              type: showPassword ? 'text' : 'password',
                              autoComplete: 'current-password',
                              value: password,
                              onChange: (e) => setPassword(e.target.value),
                              placeholder: 'Enter your password',
                              className: `w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                                errors.password
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                              } focus:outline-none focus:ring-2`,
                            }),
                            _jsx('button', {
                              type: 'button',
                              onClick: () => setShowPassword(!showPassword),
                              className:
                                'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600',
                              children: showPassword
                                ? _jsx(EyeOff, { className: 'w-5 h-5' })
                                : _jsx(Eye, { className: 'w-5 h-5' }),
                            }),
                          ],
                        }),
                        errors.password &&
                          _jsx('p', {
                            className: 'mt-1 text-sm text-red-600',
                            children: errors.password,
                          }),
                      ],
                    }),
                    _jsx('div', {
                      className:
                        'bg-blue-50 border border-blue-200 rounded-lg p-3',
                      children: _jsxs('p', {
                        className: 'text-sm text-blue-800',
                        children: [
                          _jsx('strong', { children: 'Demo Credentials:' }),
                          _jsx('br', {}),
                          'Email: demo@obs.ai',
                          _jsx('br', {}),
                          'Password: Any password works',
                        ],
                      }),
                    }),
                    _jsxs('button', {
                      type: 'submit',
                      disabled: isLoading,
                      className:
                        'w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2',
                      children: [
                        isLoading &&
                          _jsx(Loader2, { className: 'w-4 h-4 animate-spin' }),
                        isLoading ? 'Signing in...' : 'Sign in',
                      ],
                    }),
                    _jsxs('div', {
                      className: 'text-center space-y-2',
                      children: [
                        _jsx('a', {
                          href: '#',
                          className:
                            'text-sm text-indigo-600 hover:text-indigo-800 transition-colors',
                          children: 'Forgot your password?',
                        }),
                        _jsxs('div', {
                          className:
                            'flex items-center justify-center gap-4 text-xs text-gray-500',
                          children: [
                            _jsx('a', {
                              href: '#',
                              className:
                                'hover:text-gray-700 transition-colors',
                              children: 'Terms of Service',
                            }),
                            _jsx('span', { children: '\u2022' }),
                            _jsx('a', {
                              href: '#',
                              className:
                                'hover:text-gray-700 transition-colors',
                              children: 'Privacy Policy',
                            }),
                          ],
                        }),
                      ],
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
export default ModernLogin
