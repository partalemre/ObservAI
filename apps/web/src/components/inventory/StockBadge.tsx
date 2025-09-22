import React from 'react'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { t } from '../../lib/i18n'

interface StockBadgeProps {
  stockQty: number
  minQty: number
  className?: string
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stockQty,
  minQty,
  className,
}) => {
  const getStockStatus = () => {
    if (stockQty <= 0) {
      return {
        label: t('inventory.badge.out'),
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
      }
    }
    if (stockQty <= minQty) {
      return {
        label: t('inventory.badge.low'),
        variant: 'secondary' as const,
        className: 'bg-amber-100 text-amber-800',
      }
    }
    return {
      label: t('inventory.badge.ok'),
      variant: 'default' as const,
      className: 'bg-brand/10 text-brand',
    }
  }

  const status = getStockStatus()

  return (
    <Badge variant={status.variant} className={cn(status.className, className)}>
      {status.label}
    </Badge>
  )
}
