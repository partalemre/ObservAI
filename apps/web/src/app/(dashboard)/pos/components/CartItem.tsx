import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'

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

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta
    if (newQuantity <= 0) {
      onRemove?.(item.id)
    } else {
      onUpdateQuantity?.(item.id, newQuantity)
    }
  }

  return (
    <motion.div
      className="mb-3 rounded-lg border border-white/10 bg-white/5 p-3"
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-start gap-3">
        {/* Product Image */}
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-primary-400 text-sm font-bold">
                {item.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-1 text-sm font-medium text-white">
            {item.name}
          </h4>

          <div className="mt-1 flex items-center justify-between">
            <span className="text-primary-300 text-sm font-semibold">
              {formatCurrency(item.price)}
            </span>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => handleQuantityChange(-1)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="h-3 w-3 text-white" />
              </motion.button>

              <span className="min-w-[1.5rem] text-center text-sm font-medium text-white">
                {item.quantity}
              </span>

              <motion.button
                onClick={() => handleQuantityChange(1)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-3 w-3 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-400">
              {item.notes}
            </p>
          )}

          {/* Total Price */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Toplam: {formatCurrency(item.price * item.quantity)}
            </span>

            <motion.button
              onClick={() => onRemove?.(item.id)}
              className="text-red-400 transition-colors hover:text-red-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
