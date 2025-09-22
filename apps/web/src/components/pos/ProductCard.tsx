import React from 'react'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
import type { Item } from '../../features/pos/types'

interface ProductCardProps {
  item: Item
  onClick: (item: Item) => void
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onClick,
  className,
}) => {
  const handleClick = () => {
    onClick(item)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group hover:border-brand focus:border-brand focus:ring-brand/20 w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:shadow-md focus:ring-2 focus:outline-none',
        className
      )}
    >
      {/* Image placeholder */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="mb-3 h-32 w-full rounded-lg bg-gray-100 object-cover"
        />
      ) : (
        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-gray-100">
          <span className="text-2xl text-gray-400">🍽️</span>
        </div>
      )}

      {/* Content */}
      <div className="space-y-1">
        <h3 className="group-hover:text-brand font-medium text-gray-900 transition-colors">
          {item.name}
        </h3>

        <p className="text-brand text-lg font-semibold">
          {formatCurrency(item.price, 'en-US', 'TRY')}
        </p>

        {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
      </div>
    </button>
  )
}
