import React from 'react'
import { cn } from '../../lib/utils'
import type { Category } from '../../features/pos/types'

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  allLabel?: string
  className?: string
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  allLabel = 'All',
  className,
}) => {
  const safeCategories = Array.isArray(categories) ? categories : []
  const sortedCategories = [...safeCategories].sort((a, b) => a.sort - b.sort)

  return (
    <div className={cn('flex space-x-1 overflow-x-auto pb-2', className)}>
      {/* All tab */}
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className={cn(
          'relative flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors',
          activeCategory === null
            ? 'text-brand'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        {allLabel}
        {activeCategory === null && (
          <div className="from-brand to-accent absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r" />
        )}
      </button>

      {/* Category tabs */}
      {sortedCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'relative flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === category.id
              ? 'text-brand'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {category.name}
          {activeCategory === category.id && (
            <div className="from-brand to-accent absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r" />
          )}
        </button>
      ))}
    </div>
  )
}
