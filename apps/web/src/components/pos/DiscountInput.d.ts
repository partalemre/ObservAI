import React from 'react'
import type { Discount } from '../../features/pos/types'
interface DiscountInputProps {
  discount?: Discount
  onDiscountChange: (discount?: Discount) => void
  className?: string
}
export declare const DiscountInput: React.FC<DiscountInputProps>
export {}
