import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  UtensilsCrossed,
  ChefHat,
  Package,
  Users,
  Brain,
  ArrowRight,
  Clock,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { Button, Badge, Card } from '../../components/ui'
import { BrandLogo } from '../../components/brand/BrandLogo'
import { GradientBG } from '../../components/primitives/GradientBG'
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}
const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
export const Home = () => {
  return _jsxs('div', {
    className: 'bg-bg-soft min-h-screen',
    children: [
      _jsx(GradientBG, {
        className: 'relative overflow-hidden',
        children: _jsx('div', {
          className: 'container mx-auto px-4 py-20 lg:py-32',
          children: _jsxs(motion.div, {
            className: 'mx-auto max-w-4xl text-center',
            variants: staggerChildren,
            initial: 'initial',
            animate: 'animate',
            children: [
              _jsx(motion.div, {
                className: 'mb-6',
                variants: fadeInUp,
                children: _jsx(Badge, {
                  variant: 'outline',
                  className: 'mb-8',
                  children: 'Built for modern hospitality',
                }),
              }),
              _jsxs(motion.h1, {
                className:
                  'font-display text-ink mb-6 text-5xl font-bold tracking-tight lg:text-7xl',
                variants: fadeInUp,
                children: [
                  'Operate smarter with ',
                  _jsx('span', {
                    className: 'text-brand',
                    children: 'ObservAI',
                  }),
                ],
              }),
              _jsx(motion.p, {
                className:
                  'text-ink/70 mx-auto mb-8 max-w-2xl text-xl leading-relaxed',
                variants: fadeInUp,
                children:
                  'Unify POS, menu, kitchen, inventory and AI insights in one place.',
              }),
              _jsxs(motion.div, {
                className:
                  'mb-16 flex flex-col justify-center gap-4 sm:flex-row',
                variants: fadeInUp,
                children: [
                  _jsxs(Button, {
                    size: 'lg',
                    variant: 'accent',
                    className: 'px-8 py-4 text-lg',
                    children: [
                      'Request a demo',
                      _jsx(ArrowRight, { className: 'ml-2 h-5 w-5' }),
                    ],
                  }),
                  _jsx(Button, {
                    size: 'lg',
                    variant: 'secondary',
                    className: 'px-8 py-4 text-lg',
                    asChild: true,
                    children: _jsx(Link, { to: '/login', children: 'Sign in' }),
                  }),
                ],
              }),
              _jsx(motion.div, {
                className: 'relative mx-auto max-w-5xl',
                variants: fadeInUp,
                children: _jsx('div', {
                  className:
                    'border-border rounded-3xl border bg-white p-8 shadow-2xl',
                  children: _jsxs('div', {
                    className: 'grid grid-cols-1 gap-6 md:grid-cols-3',
                    children: [
                      _jsxs(Card, {
                        className: 'p-4',
                        children: [
                          _jsxs('div', {
                            className: 'mb-4 flex items-center gap-3',
                            children: [
                              _jsx(BarChart3, {
                                className: 'text-brand h-5 w-5',
                              }),
                              _jsx('span', {
                                className: 'text-ink font-semibold',
                                children: 'Analytics',
                              }),
                            ],
                          }),
                          _jsx('div', {
                            className:
                              'from-brand/20 to-accent/20 h-20 rounded-xl bg-gradient-to-br',
                          }),
                        ],
                      }),
                      _jsxs(Card, {
                        className: 'p-4',
                        children: [
                          _jsxs('div', {
                            className: 'mb-4 flex items-center gap-3',
                            children: [
                              _jsx(UtensilsCrossed, {
                                className: 'text-brand h-5 w-5',
                              }),
                              _jsx('span', {
                                className: 'text-ink font-semibold',
                                children: 'Orders',
                              }),
                            ],
                          }),
                          _jsx('div', {
                            className:
                              'from-accent/20 to-brand/20 h-20 rounded-xl bg-gradient-to-br',
                          }),
                        ],
                      }),
                      _jsxs(Card, {
                        className: 'p-4',
                        children: [
                          _jsxs('div', {
                            className: 'mb-4 flex items-center gap-3',
                            children: [
                              _jsx(Brain, { className: 'text-brand h-5 w-5' }),
                              _jsx('span', {
                                className: 'text-ink font-semibold',
                                children: 'AI Insights',
                              }),
                            ],
                          }),
                          _jsx('div', {
                            className:
                              'from-brand/20 to-accent/20 h-20 rounded-xl bg-gradient-to-br',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
        }),
      }),
      _jsx('section', {
        className: 'border-border border-y bg-white py-16',
        children: _jsxs('div', {
          className: 'container mx-auto px-4',
          children: [
            _jsx('p', {
              className: 'text-ink/60 mb-8 text-center font-medium',
              children: 'Trusted by restaurants worldwide',
            }),
            _jsx('div', {
              className: 'flex items-center justify-center gap-12 opacity-40',
              children: [1, 2, 3, 4, 5, 6].map((i) =>
                _jsx(
                  'div',
                  {
                    className:
                      'bg-ink/10 flex h-12 w-24 items-center justify-center rounded-lg',
                    children: _jsxs('span', {
                      className: 'text-ink/40 font-semibold',
                      children: ['Logo ', i],
                    }),
                  },
                  i
                )
              ),
            }),
          ],
        }),
      }),
      _jsx('section', {
        className: 'bg-bg-soft py-20',
        children: _jsx('div', {
          className: 'container mx-auto px-4',
          children: _jsxs(motion.div, {
            className:
              'mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3',
            variants: staggerChildren,
            initial: 'initial',
            whileInView: 'animate',
            viewport: { once: true },
            children: [
              _jsx(motion.div, {
                variants: fadeInUp,
                children: _jsxs(Card, {
                  className: 'p-8 text-center',
                  children: [
                    _jsx('div', {
                      className:
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100',
                      children: _jsx(DollarSign, {
                        className: 'h-8 w-8 text-green-600',
                      }),
                    }),
                    _jsx('h3', {
                      className:
                        'font-display text-ink mb-2 text-2xl font-bold',
                      children: '30%',
                    }),
                    _jsx('p', {
                      className: 'text-ink/70',
                      children: 'Reduce ops cost',
                    }),
                  ],
                }),
              }),
              _jsx(motion.div, {
                variants: fadeInUp,
                children: _jsxs(Card, {
                  className: 'p-8 text-center',
                  children: [
                    _jsx('div', {
                      className:
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100',
                      children: _jsx(TrendingUp, {
                        className: 'h-8 w-8 text-blue-600',
                      }),
                    }),
                    _jsx('h3', {
                      className:
                        'font-display text-ink mb-2 text-2xl font-bold',
                      children: '25%',
                    }),
                    _jsx('p', {
                      className: 'text-ink/70',
                      children: 'Increase AOV',
                    }),
                  ],
                }),
              }),
              _jsx(motion.div, {
                variants: fadeInUp,
                children: _jsxs(Card, {
                  className: 'p-8 text-center',
                  children: [
                    _jsx('div', {
                      className:
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100',
                      children: _jsx(Clock, {
                        className: 'h-8 w-8 text-purple-600',
                      }),
                    }),
                    _jsx('h3', {
                      className:
                        'font-display text-ink mb-2 text-2xl font-bold',
                      children: 'Real-time',
                    }),
                    _jsx('p', {
                      className: 'text-ink/70',
                      children: 'See peak hours',
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
      _jsx('section', {
        className: 'bg-white py-20',
        children: _jsxs('div', {
          className: 'container mx-auto px-4',
          children: [
            _jsxs('div', {
              className: 'mb-16 text-center',
              children: [
                _jsx('h2', {
                  className: 'font-display text-ink mb-4 text-4xl font-bold',
                  children: 'Everything you need to run your restaurant',
                }),
                _jsx('p', {
                  className: 'text-ink/70 mx-auto max-w-2xl text-xl',
                  children:
                    'From orders to insights, manage every aspect of your business with one platform',
                }),
              ],
            }),
            _jsx(motion.div, {
              className:
                'mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
              variants: staggerChildren,
              initial: 'initial',
              whileInView: 'animate',
              viewport: { once: true },
              children: [
                {
                  icon: BarChart3,
                  title: 'Smart POS',
                  description:
                    'Lightning-fast checkout with built-in analytics',
                },
                {
                  icon: UtensilsCrossed,
                  title: 'Dynamic Menu',
                  description:
                    'Real-time menu updates and pricing optimization',
                },
                {
                  icon: ChefHat,
                  title: 'Kitchen Display',
                  description: 'Streamlined order management for your kitchen',
                },
                {
                  icon: Package,
                  title: 'Inventory Alerts',
                  description: 'Never run out with smart inventory tracking',
                },
                {
                  icon: Users,
                  title: 'Staff & Tips',
                  description:
                    'Team management and tip distribution (coming soon)',
                  badge: 'Soon',
                },
                {
                  icon: Brain,
                  title: 'AI Insights',
                  description: 'Predictive analytics and business intelligence',
                },
              ].map((feature, index) =>
                _jsx(
                  motion.div,
                  {
                    variants: fadeInUp,
                    children: _jsxs(Card, {
                      className: 'h-full p-6 transition-shadow hover:shadow-lg',
                      children: [
                        _jsx('div', {
                          className:
                            'bg-brand/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                          children: _jsx(feature.icon, {
                            className: 'text-brand h-6 w-6',
                          }),
                        }),
                        _jsxs('div', {
                          className: 'mb-2 flex items-center gap-2',
                          children: [
                            _jsx('h3', {
                              className:
                                'font-display text-ink text-lg font-semibold',
                              children: feature.title,
                            }),
                            feature.badge &&
                              _jsx(Badge, {
                                variant: 'outline',
                                size: 'sm',
                                children: feature.badge,
                              }),
                          ],
                        }),
                        _jsx('p', {
                          className: 'text-ink/70',
                          children: feature.description,
                        }),
                      ],
                    }),
                  },
                  index
                )
              ),
            }),
          ],
        }),
      }),
      _jsx('section', {
        className: 'bg-bg-soft py-16',
        children: _jsxs('div', {
          className: 'container mx-auto px-4',
          children: [
            _jsx('div', {
              className: 'mb-12 text-center',
              children: _jsx('h2', {
                className: 'font-display text-ink mb-4 text-3xl font-bold',
                children: 'Connects with your favorite tools',
              }),
            }),
            _jsx('div', {
              className:
                'mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4',
              children: ['Yemeksepeti', 'Getir', 'Trendyol', 'Open API'].map(
                (integration, index) =>
                  _jsx(
                    Badge,
                    {
                      variant: 'outline',
                      className: 'px-4 py-2 text-sm',
                      children: integration,
                    },
                    index
                  )
              ),
            }),
          ],
        }),
      }),
      _jsx('footer', {
        className: 'border-border border-t bg-white py-16',
        children: _jsxs('div', {
          className: 'container mx-auto px-4',
          children: [
            _jsxs('div', {
              className:
                'flex flex-col items-center justify-between md:flex-row',
              children: [
                _jsx(BrandLogo, { size: 'md' }),
                _jsxs('div', {
                  className: 'mt-8 flex items-center gap-8 md:mt-0',
                  children: [
                    _jsx(Link, {
                      to: '/docs',
                      className: 'text-ink/70 hover:text-ink transition-colors',
                      children: 'Docs',
                    }),
                    _jsx(Link, {
                      to: '/changelog',
                      className: 'text-ink/70 hover:text-ink transition-colors',
                      children: 'Changelog',
                    }),
                    _jsx(Link, {
                      to: '/contact',
                      className: 'text-ink/70 hover:text-ink transition-colors',
                      children: 'Contact',
                    }),
                  ],
                }),
              ],
            }),
            _jsx('div', {
              className:
                'border-border text-ink/60 mt-8 border-t pt-8 text-center',
              children: _jsx('p', {
                children: '\u00A9 2024 ObservAI. All rights reserved.',
              }),
            }),
          ],
        }),
      }),
    ],
  })
}
