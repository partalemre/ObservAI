import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Package } from 'lucide-react'
import { fetchTopProducts } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'
export const TopProductsTable = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: fetchTopProducts,
    refetchInterval: 30000, // 30 saniyede bir güncelle
  })
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  if (isLoading) {
    return _jsxs('div', {
      className: 'glass-card rounded-xl p-6',
      children: [
        _jsxs('div', {
          className: 'flex items-center gap-3 mb-4',
          children: [
            _jsx(Skeleton, { className: 'h-10 w-10 rounded-lg' }),
            _jsx(Skeleton, { className: 'h-6 w-32' }),
          ],
        }),
        _jsx('div', {
          className: 'space-y-3',
          children: Array.from({ length: 5 }).map((_, i) =>
            _jsxs(
              'div',
              {
                className: 'flex items-center justify-between',
                children: [
                  _jsx(Skeleton, { className: 'h-4 w-24' }),
                  _jsx(Skeleton, { className: 'h-4 w-16' }),
                ],
              },
              i
            )
          ),
        }),
      ],
    })
  }
  return _jsxs(motion.div, {
    className:
      'glass-card rounded-xl p-6 hover:border-white/20 transition-all duration-300',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.3 },
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-3 mb-6',
        children: [
          _jsx('div', {
            className:
              'w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center',
            children: _jsx(Package, { className: 'w-5 h-5 text-accent-400' }),
          }),
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-white',
                children: 'En \u00C7ok Satanlar',
              }),
              _jsx('p', {
                className: 'text-sm text-white/60',
                children: 'Bug\u00FCn\u00FCn pop\u00FCler \u00FCr\u00FCnleri',
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'space-y-4',
        children: products?.map((product, index) =>
          _jsxs(
            motion.div,
            {
              className:
                'flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 group',
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
              whileHover: { scale: 1.02 },
              children: [
                _jsxs('div', {
                  className: 'flex items-center gap-3',
                  children: [
                    _jsxs('div', {
                      className:
                        'flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold text-sm',
                      children: ['#', index + 1],
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('p', {
                          className:
                            'text-white font-medium group-hover:text-primary-300 transition-colors',
                          children: product.name,
                        }),
                        _jsxs('p', {
                          className: 'text-sm text-white/60',
                          children: [product.quantity, ' adet'],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'text-right',
                  children: [
                    _jsx('p', {
                      className: 'text-white font-semibold',
                      children: formatCurrency(product.revenue),
                    }),
                    _jsxs('div', {
                      className:
                        'flex items-center justify-end gap-1 text-sm text-green-400',
                      children: [
                        _jsx(TrendingUp, { className: 'w-3 h-3' }),
                        _jsxs('span', {
                          children: [
                            '+',
                            (
                              (product.revenue / product.quantity) *
                              0.1
                            ).toFixed(1),
                            '%',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            product.id
          )
        ),
      }),
      _jsx('div', {
        className: 'mt-6 pt-4 border-t border-white/10',
        children: _jsxs('div', {
          className: 'flex justify-between items-center text-sm',
          children: [
            _jsx('span', {
              className: 'text-white/60',
              children: 'Toplam Sat\u0131\u015F',
            }),
            _jsx('span', {
              className: 'text-white font-semibold',
              children: formatCurrency(
                products?.reduce((sum, p) => sum + p.revenue, 0) || 0
              ),
            }),
          ],
        }),
      }),
    ],
  })
}
