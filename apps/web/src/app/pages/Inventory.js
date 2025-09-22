import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Skeleton, EmptyState } from '../../components/ui'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { StockBadge } from '../../components/inventory/StockBadge'
import { ReceiveDialog } from '../../components/inventory/ReceiveDialog'
import { AdjustDialog } from '../../components/inventory/AdjustDialog'
import { ThresholdEditor } from '../../components/inventory/ThresholdEditor'
import { useInventoryItems } from '../../features/inventory/hooks'
import { useOrgStore } from '../../store/orgStore'
import { formatCurrency } from '../../lib/format'
import { cn } from '../../lib/utils'
import { t } from '../../lib/i18n'
import { formatDistanceToNow } from 'date-fns'
export const Inventory = () => {
  const { selectedStoreId } = useOrgStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const { data: items = [], isLoading } = useInventoryItems(
    selectedStoreId || undefined
  )
  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    )
    return cats.sort()
  }, [items])
  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = items
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku?.toLowerCase().includes(query)
      )
    }
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => {
        if (statusFilter === 'out') return item.stockQty <= 0
        if (statusFilter === 'low')
          return item.stockQty > 0 && item.stockQty <= item.minQty
        if (statusFilter === 'ok') return item.stockQty > item.minQty
        return true
      })
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [items, searchQuery, categoryFilter, statusFilter])
  const getRowClassName = (item) => {
    if (item.stockQty <= 0) return 'bg-red-50 border-red-200'
    if (item.stockQty <= item.minQty) return 'bg-amber-50 border-amber-200'
    return ''
  }
  if (!selectedStoreId) {
    return _jsx('div', {
      className: 'p-6',
      children: _jsx(EmptyState, {
        title: 'No Store Selected',
        description: 'Please select a store to view inventory',
      }),
    })
  }
  return _jsxs('div', {
    className: 'flex h-full flex-col',
    children: [
      _jsxs('div', {
        className: 'border-b border-gray-200 p-6',
        children: [
          _jsxs('div', {
            className: 'mb-6 flex items-center justify-between',
            children: [
              _jsx('h1', {
                className: 'text-2xl font-bold text-gray-900',
                children: t('inventory.title'),
              }),
              _jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  _jsx(Button, {
                    onClick: () => setReceiveDialogOpen(true),
                    variant: 'accent',
                    children: t('inventory.actions.receive'),
                  }),
                  _jsx(Button, {
                    onClick: () => setAdjustDialogOpen(true),
                    variant: 'outline',
                    children: t('inventory.actions.adjust'),
                  }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex flex-col gap-4 lg:flex-row',
            children: [
              _jsxs('div', {
                className: 'relative flex-1',
                children: [
                  _jsx(Search, {
                    className:
                      'absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400',
                  }),
                  _jsx(Input, {
                    type: 'text',
                    placeholder: t('inventory.search'),
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: 'pl-10',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsxs('span', {
                    className:
                      'text-sm font-medium whitespace-nowrap text-gray-700',
                    children: [t('inventory.category'), ':'],
                  }),
                  _jsxs('select', {
                    value: categoryFilter,
                    onChange: (e) => setCategoryFilter(e.target.value),
                    className:
                      'focus:border-brand focus:ring-brand rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none',
                    children: [
                      _jsx('option', { value: 'all', children: 'All' }),
                      categories.map((category) =>
                        _jsx(
                          'option',
                          { value: category, children: category },
                          category
                        )
                      ),
                    ],
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  _jsxs('span', {
                    className:
                      'text-sm font-medium whitespace-nowrap text-gray-700',
                    children: [t('inventory.status'), ':'],
                  }),
                  _jsx('div', {
                    className:
                      'flex rounded-lg border border-gray-200 bg-gray-50 p-1',
                    children: ['all', 'low', 'out', 'ok'].map((status) =>
                      _jsx(
                        'button',
                        {
                          onClick: () => setStatusFilter(status),
                          className: cn(
                            'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                            statusFilter === status
                              ? 'text-brand bg-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          ),
                          children: t(`inventory.statuses.${status}`),
                        },
                        status
                      )
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex-1 overflow-auto p-6',
        children: isLoading
          ? _jsx('div', {
              className: 'space-y-4',
              children: Array.from({ length: 5 }).map((_, i) =>
                _jsx(Skeleton, { className: 'h-16 w-full' }, i)
              ),
            })
          : filteredItems.length === 0
            ? _jsx(EmptyState, {
                title:
                  searchQuery ||
                  categoryFilter !== 'all' ||
                  statusFilter !== 'all'
                    ? 'No items found'
                    : t('inventory.empty'),
                description:
                  searchQuery ||
                  categoryFilter !== 'all' ||
                  statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Add inventory items to get started',
              })
            : _jsx('div', {
                className: 'overflow-x-auto',
                children: _jsxs('table', {
                  className: 'w-full',
                  children: [
                    _jsx('thead', {
                      children: _jsxs('tr', {
                        className: 'border-b border-gray-200',
                        children: [
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.item'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.sku'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.cat'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.onhand'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.min'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.reorder'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.cost'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.updated'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.state'),
                          }),
                          _jsx('th', {
                            className:
                              'px-4 py-3 text-left font-medium text-gray-900',
                            children: t('inventory.columns.actions'),
                          }),
                        ],
                      }),
                    }),
                    _jsx('tbody', {
                      children: filteredItems.map((item) =>
                        _jsxs(
                          'tr',
                          {
                            className: cn(
                              'border-b border-gray-100 hover:bg-gray-50',
                              getRowClassName(item)
                            ),
                            children: [
                              _jsxs('td', {
                                className: 'px-4 py-3',
                                children: [
                                  _jsx('div', {
                                    className: 'font-medium text-gray-900',
                                    children: item.name,
                                  }),
                                  item.uom &&
                                    _jsxs('div', {
                                      className: 'text-sm text-gray-500',
                                      children: ['per ', item.uom],
                                    }),
                                ],
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: item.sku || '-',
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: item.category || '-',
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3',
                                children: _jsx('span', {
                                  className: cn(
                                    'font-medium',
                                    item.stockQty <= 0 && 'text-red-600',
                                    item.stockQty > 0 &&
                                      item.stockQty <= item.minQty &&
                                      'text-amber-600'
                                  ),
                                  children: item.stockQty,
                                }),
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: item.minQty,
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: item.reorderQty || '-',
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: item.costPrice
                                  ? formatCurrency(
                                      item.costPrice,
                                      'en-US',
                                      'TRY'
                                    )
                                  : '-',
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3 text-sm text-gray-600',
                                children: formatDistanceToNow(
                                  new Date(item.updatedAt),
                                  {
                                    addSuffix: true,
                                  }
                                ),
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3',
                                children: _jsx(StockBadge, {
                                  stockQty: item.stockQty,
                                  minQty: item.minQty,
                                }),
                              }),
                              _jsx('td', {
                                className: 'px-4 py-3',
                                children: _jsx(ThresholdEditor, {
                                  item: item,
                                  disabled: item.stockQty <= 0,
                                }),
                              }),
                            ],
                          },
                          item.id
                        )
                      ),
                    }),
                  ],
                }),
              }),
      }),
      _jsx(ReceiveDialog, {
        open: receiveDialogOpen,
        onClose: () => setReceiveDialogOpen(false),
        items: items,
        storeId: selectedStoreId,
      }),
      _jsx(AdjustDialog, {
        open: adjustDialogOpen,
        onClose: () => setAdjustDialogOpen(false),
        items: items,
        storeId: selectedStoreId,
      }),
    ],
  })
}
