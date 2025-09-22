import React from 'react'
import type { Item } from '../../features/pos/types'
interface ProductCardProps {
  item: Item
  onClick: (item: Item) => void
  className?: string
}
export declare const ProductCard: React.FC<ProductCardProps>
export {}
