import React from 'react'
import { AlertTriangle, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, Badge } from '../../components/ui'
import { StockBadge } from '../../components/inventory/StockBadge'
import { useInventoryItems } from '../../features/inventory/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'

export const Alerts: React.FC = () => {
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {t('alerts.title')}
        </h1>
      </div>

      {/* Low Stock Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('alerts.lowStock')}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                {outOfStockItems.length > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {outOfStockItems.length} Out
                  </Badge>
                )}
                {lowStockItems.length > 0 && (
                  <Badge className="bg-amber-100 text-amber-800">
                    {lowStockItems.length} Low
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {hasIssues && (
            <Link
              to="/inventory"
              className="text-brand hover:text-brand/80 text-sm font-medium"
            >
              {t('alerts.viewInventory')}
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : hasIssues ? (
          <div className="space-y-3">
            {allIssues.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.sku && `${item.sku} • `}
                      {item.category || 'No category'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {item.stockQty} / {item.minQty}
                    </div>
                    <div className="text-xs text-gray-500">on hand / min</div>
                  </div>
                  <StockBadge stockQty={item.stockQty} minQty={item.minQty} />
                </div>
              </div>
            ))}
            {allIssues.length > 5 && (
              <div className="pt-2 text-center">
                <Link
                  to="/inventory"
                  className="text-brand hover:text-brand/80 text-sm font-medium"
                >
                  View {allIssues.length - 5} more items
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {t('alerts.allGood')}
            </h3>
            <p className="text-gray-600">
              All inventory levels are above minimum thresholds.
            </p>
          </div>
        )}
      </div>

      {/* Additional Alert Sections can be added here */}
    </div>
  )
}
