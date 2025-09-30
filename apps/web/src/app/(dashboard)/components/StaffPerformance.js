import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Users, Star, Trophy } from 'lucide-react'
import { fetchStaffPerformance } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'
export const StaffPerformance = () => {
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff-performance'],
    queryFn: fetchStaffPerformance,
    refetchInterval: 30000,
  })
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  const getPerformanceColor = (rating) => {
    if (rating >= 4.8) return 'text-green-400 bg-green-500/20'
    if (rating >= 4.5) return 'text-blue-400 bg-blue-500/20'
    if (rating >= 4.0) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }
  if (isLoading) {
    return _jsxs('div', {
      className: 'glass-card rounded-xl p-6',
      children: [
        _jsxs('div', {
          className: 'flex items-center gap-3 mb-4',
          children: [
            _jsx(Skeleton, { className: 'h-10 w-10 rounded-lg' }),
            _jsx(Skeleton, { className: 'h-6 w-40' }),
          ],
        }),
        _jsx('div', {
          className: 'space-y-4',
          children: Array.from({ length: 4 }).map((_, i) =>
            _jsxs(
              'div',
              {
                className: 'flex items-center gap-3 p-3',
                children: [
                  _jsx(Skeleton, { className: 'h-10 w-10 rounded-full' }),
                  _jsxs('div', {
                    className: 'flex-1',
                    children: [
                      _jsx(Skeleton, { className: 'h-4 w-24 mb-2' }),
                      _jsx(Skeleton, { className: 'h-3 w-16' }),
                    ],
                  }),
                  _jsx(Skeleton, { className: 'h-4 w-12' }),
                ],
              },
              i
            )
          ),
        }),
      ],
    })
  }
  const topPerformer = staff?.[0]
  return _jsxs(motion.div, {
    className:
      'glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4 },
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-3 mb-6',
        children: [
          _jsx('div', {
            className:
              'w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center',
            children: _jsx(Users, { className: 'w-5 h-5 text-green-400' }),
          }),
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-white',
                children: 'Personel Performans\u0131',
              }),
              _jsx('p', {
                className: 'text-sm text-white/60',
                children:
                  'G\u00FCnl\u00FCk ba\u015Far\u0131m s\u0131ralamas\u0131',
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'space-y-4',
        children: staff?.map((member, index) =>
          _jsxs(
            motion.div,
            {
              className:
                'relative flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 group',
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
              whileHover: { scale: 1.02 },
              children: [
                _jsxs('div', {
                  className: 'relative',
                  children: [
                    _jsx('div', {
                      className: `flex items-center justify-center w-10 h-10 rounded-full ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary-500/20 text-primary-400'} font-bold text-sm`,
                      children:
                        index === 0
                          ? _jsx(Trophy, { className: 'w-5 h-5' })
                          : `#${index + 1}`,
                    }),
                    index === 0 &&
                      _jsx('div', {
                        className:
                          'absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center',
                        children: _jsx('span', {
                          className: 'text-xs text-black',
                          children: '\uD83D\uDC51',
                        }),
                      }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex-1',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center justify-between mb-1',
                      children: [
                        _jsx('p', {
                          className:
                            'text-white font-medium group-hover:text-primary-300 transition-colors',
                          children: member.name,
                        }),
                        _jsxs('div', {
                          className: `flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getPerformanceColor(member.rating)}`,
                          children: [
                            _jsx(Star, {
                              className: 'w-3 h-3',
                              fill: 'currentColor',
                            }),
                            member.rating.toFixed(1),
                          ],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center justify-between text-sm',
                      children: [
                        _jsxs('span', {
                          className: 'text-white/60',
                          children: [member.orders, ' sipari\u015F'],
                        }),
                        _jsx('span', {
                          className: 'text-accent-400 font-semibold',
                          children: formatCurrency(member.revenue),
                        }),
                      ],
                    }),
                    _jsx('div', {
                      className: 'mt-2 w-full bg-white/10 rounded-full h-1.5',
                      children: _jsx(motion.div, {
                        className: `h-full rounded-full ${index === 0 ? 'bg-yellow-400' : 'bg-primary-500'}`,
                        initial: { width: 0 },
                        animate: { width: `${(member.rating / 5) * 100}%` },
                        transition: { delay: index * 0.2, duration: 1 },
                      }),
                    }),
                  ],
                }),
              ],
            },
            member.id
          )
        ),
      }),
      _jsx('div', {
        className: 'mt-6 pt-4 border-t border-white/10',
        children: _jsxs('div', {
          className: 'grid grid-cols-2 gap-4 text-center',
          children: [
            _jsxs('div', {
              children: [
                _jsx('p', {
                  className: 'text-2xl font-bold text-white',
                  children: staff?.reduce((sum, s) => sum + s.orders, 0) || 0,
                }),
                _jsx('p', {
                  className: 'text-xs text-white/60',
                  children: 'Toplam Sipari\u015F',
                }),
              ],
            }),
            _jsxs('div', {
              children: [
                _jsx('p', {
                  className: 'text-2xl font-bold text-accent-400',
                  children: (
                    (staff?.reduce((sum, s) => sum + s.rating, 0) || 0) /
                    (staff?.length || 1)
                  ).toFixed(1),
                }),
                _jsx('p', {
                  className: 'text-xs text-white/60',
                  children: 'Ortalama Puan',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  })
}
