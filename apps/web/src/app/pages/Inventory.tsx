import React, { useState, useMemo } from 'react'
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
import type { InventoryItem } from '../../features/inventory/types'

type StatusFilter = 'all' | 'low' | 'out' | 'ok'

export const Inventory: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
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

  const getRowClassName = (item: InventoryItem) => {
    if (item.stockQty <= 0) return 'bg-red-50 border-red-200'
    if (item.stockQty <= item.minQty) return 'bg-amber-50 border-amber-200'
    return ''
  }

  if (!selectedStoreId) {
    return (
      <div className="p-6">
        <EmptyState
          title="No Store Selected"
          description="Please select a store to view inventory"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('inventory.title')}
          </h1>
          <div className="flex items-center gap-3">
            <Button onClick={() => setReceiveDialogOpen(true)} variant="accent">
              {t('inventory.actions.receive')}
            </Button>
            <Button onClick={() => setAdjustDialogOpen(true)} variant="outline">
              {t('inventory.actions.adjust')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder={t('inventory.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap text-gray-700">
              {t('inventory.category')}:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="focus:border-brand focus:ring-brand rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap text-gray-700">
              {t('inventory.status')}:
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              {(['all', 'low', 'out', 'ok'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    statusFilter === status
                      ? 'text-brand bg-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {t(`inventory.statuses.${status}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={
              searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No items found'
                : t('inventory.empty')
            }
            description={
              searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add inventory items to get started'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.item')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.sku')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.cat')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.onhand')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.min')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.reorder')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.cost')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.updated')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.state')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    {t('inventory.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'border-b border-gray-100 hover:bg-gray-50',
                      getRowClassName(item)
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      {item.uom && (
                        <div className="text-sm text-gray-500">
                          per {item.uom}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.sku || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.category || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'font-medium',
                          item.stockQty <= 0 && 'text-red-600',
                          item.stockQty > 0 &&
                            item.stockQty <= item.minQty &&
                            'text-amber-600'
                        )}
                      >
                        {item.stockQty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.minQty}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.reorderQty || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.costPrice
                        ? formatCurrency(item.costPrice, 'en-US', 'TRY')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDistanceToNow(new Date(item.updatedAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StockBadge
                        stockQty={item.stockQty}
                        minQty={item.minQty}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <ThresholdEditor
                        item={item}
                        disabled={item.stockQty <= 0}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ReceiveDialog
        open={receiveDialogOpen}
        onClose={() => setReceiveDialogOpen(false)}
        items={items}
        storeId={selectedStoreId}
      />

      <AdjustDialog
        open={adjustDialogOpen}
        onClose={() => setAdjustDialogOpen(false)}
        items={items}
        storeId={selectedStoreId}
      />
    </div>
  )
}
