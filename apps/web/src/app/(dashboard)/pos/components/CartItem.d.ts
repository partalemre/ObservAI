import React from 'react'
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  notes?: string
}
interface CartItemProps {
  item: CartItem
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}
export declare const CartItem: React.FC<CartItemProps>
export {}
