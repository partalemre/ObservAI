import React from 'react'
import { CartItem } from './CartItem'
interface CartSummaryProps {
  cart: CartItem[]
  discount?: number
  tax?: number
}
export declare const CartSummary: React.FC<CartSummaryProps>
export {}
