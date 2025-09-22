import React from 'react'
import type { Category } from '../../features/pos/types'
interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  allLabel?: string
  className?: string
}
export declare const CategoryTabs: React.FC<CategoryTabsProps>
export {}
