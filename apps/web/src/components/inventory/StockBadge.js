import { jsx as _jsx } from 'react/jsx-runtime'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { t } from '../../lib/i18n'
export const StockBadge = ({ stockQty, minQty, className }) => {
  const getStockStatus = () => {
    if (stockQty <= 0) {
      return {
        label: t('inventory.badge.out'),
        variant: 'destructive',
        className: 'bg-red-100 text-red-800',
      }
    }
    if (stockQty <= minQty) {
      return {
        label: t('inventory.badge.low'),
        variant: 'secondary',
        className: 'bg-amber-100 text-amber-800',
      }
    }
    return {
      label: t('inventory.badge.ok'),
      variant: 'default',
      className: 'bg-brand/10 text-brand',
    }
  }
  const status = getStockStatus()
  return _jsx(Badge, {
    variant: status.variant,
    className: cn(status.className, className),
    children: status.label,
  })
}
