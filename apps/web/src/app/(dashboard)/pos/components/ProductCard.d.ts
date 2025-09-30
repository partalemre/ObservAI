import React from 'react'
interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  rating?: number
  description?: string
  inStock: boolean
}
interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}
export declare const ProductCard: React.FC<ProductCardProps>
export {}
