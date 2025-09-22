import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { StockBadge } from '../../components/inventory/StockBadge'
import { useInventoryItems } from '../../features/inventory/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
export const Alerts = () => {
  const { selectedStoreId } = useOrgStore()
  const { data: items = [], isLoading } = useInventoryItems(
    selectedStoreId || undefined
  )
  // Get low stock and out of stock items
  const lowStockItems = items.filter(
    (item) => item.stockQty > 0 && item.stockQty <= item.minQty
  )
  const outOfStockItems = items.filter((item) => item.stockQty <= 0)
  const allIssues = [...outOfStockItems, ...lowStockItems]
  const hasIssues = allIssues.length > 0
  return _jsxs('div', {
    className: 'space-y-6 p-6',
    children: [
      _jsx('div', {
        children: _jsx('h1', {
          className: 'mb-2 text-2xl font-bold text-gray-900',
          children: t('alerts.title'),
        }),
      }),
      _jsxs('div', {
        className: 'rounded-lg border border-gray-200 bg-white p-6',
        children: [
          _jsxs('div', {
            className: 'mb-4 flex items-center justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  _jsx('div', {
                    className:
                      'flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100',
                    children: _jsx(Package, {
                      className: 'h-5 w-5 text-amber-600',
                    }),
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('h2', {
                        className: 'text-lg font-semibold text-gray-900',
                        children: t('alerts.lowStock'),
                      }),
                      _jsxs('div', {
                        className: 'mt-1 flex items-center gap-2',
                        children: [
                          outOfStockItems.length > 0 &&
                            _jsxs(Badge, {
                              className: 'bg-red-100 text-red-800',
                              children: [outOfStockItems.length, ' Out'],
                            }),
                          lowStockItems.length > 0 &&
                            _jsxs(Badge, {
                              className: 'bg-amber-100 text-amber-800',
                              children: [lowStockItems.length, ' Low'],
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              hasIssues &&
                _jsx(Link, {
                  to: '/inventory',
                  className:
                    'text-brand hover:text-brand/80 text-sm font-medium',
                  children: t('alerts.viewInventory'),
                }),
            ],
          }),
          isLoading
            ? _jsx('div', {
                className: 'space-y-3',
                children: Array.from({ length: 3 }).map((_, i) =>
                  _jsx(
                    'div',
                    {
                      className: 'animate-pulse',
                      children: _jsx('div', {
                        className: 'h-4 w-3/4 rounded bg-gray-200',
                      }),
                    },
                    i
                  )
                ),
              })
            : hasIssues
              ? _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    allIssues
                      .slice(0, 5)
                      .map((item) =>
                        _jsxs(
                          'div',
                          {
                            className:
                              'flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2',
                            children: [
                              _jsx('div', {
                                className: 'flex items-center gap-3',
                                children: _jsxs('div', {
                                  children: [
                                    _jsx('div', {
                                      className: 'font-medium text-gray-900',
                                      children: item.name,
                                    }),
                                    _jsxs('div', {
                                      className: 'text-sm text-gray-500',
                                      children: [
                                        item.sku && `${item.sku} • `,
                                        item.category || 'No category',
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              _jsxs('div', {
                                className: 'flex items-center gap-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'text-right',
                                    children: [
                                      _jsxs('div', {
                                        className: 'text-sm text-gray-600',
                                        children: [
                                          item.stockQty,
                                          ' / ',
                                          item.minQty,
                                        ],
                                      }),
                                      _jsx('div', {
                                        className: 'text-xs text-gray-500',
                                        children: 'on hand / min',
                                      }),
                                    ],
                                  }),
                                  _jsx(StockBadge, {
                                    stockQty: item.stockQty,
                                    minQty: item.minQty,
                                  }),
                                ],
                              }),
                            ],
                          },
                          item.id
                        )
                      ),
                    allIssues.length > 5 &&
                      _jsx('div', {
                        className: 'pt-2 text-center',
                        children: _jsxs(Link, {
                          to: '/inventory',
                          className:
                            'text-brand hover:text-brand/80 text-sm font-medium',
                          children: [
                            'View ',
                            allIssues.length - 5,
                            ' more items',
                          ],
                        }),
                      }),
                  ],
                })
              : _jsxs('div', {
                  className: 'py-8 text-center',
                  children: [
                    _jsx('div', {
                      className:
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100',
                      children: _jsx(Package, {
                        className: 'h-8 w-8 text-green-600',
                      }),
                    }),
                    _jsx('h3', {
                      className: 'mb-2 text-lg font-medium text-gray-900',
                      children: t('alerts.allGood'),
                    }),
                    _jsx('p', {
                      className: 'text-gray-600',
                      children:
                        'All inventory levels are above minimum thresholds.',
                    }),
                  ],
                }),
        ],
      }),
    ],
  })
}
