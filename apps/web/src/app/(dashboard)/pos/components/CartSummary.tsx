import React from 'react'
import { motion } from 'framer-motion'
import { Receipt, Percent, Gift } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'
import { CartItem } from './CartItem'

interface CartSummaryProps {
  cart: CartItem[]
  discount?: number
  tax?: number
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  discount = 0,
  tax = 0.18,
}) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * tax
  const total = taxableAmount + taxAmount
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Item Count */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Ürün Sayısı</span>
        </div>
        <span className="font-medium text-white">{itemCount} adet</span>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Ara Toplam</span>
        <span className="font-medium text-white">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-green-400" />
            <span className="text-green-400">İndirim (%{discount})</span>
          </div>
          <span className="font-medium text-green-400">
            -{formatCurrency(discountAmount)}
          </span>
        </div>
      )}

      {/* Tax */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">KDV (%{(tax * 100).toFixed(0)})</span>
        <span className="font-medium text-white">
          {formatCurrency(taxAmount)}
        </span>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-white/10" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-white">Toplam</span>
        <span className="text-primary-300 text-xl font-bold">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <motion.button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Percent className="h-3 w-3" />
          İndirim
        </motion.button>

        <motion.button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Gift className="h-3 w-3" />
          Kupon
        </motion.button>
      </div>

      {/* Payment Methods Preview */}
      <div className="mt-4 rounded-lg bg-white/5 p-3">
        <div className="mb-2 text-xs text-gray-400">Ödeme Seçenekleri</div>
        <div className="flex gap-2">
          <div className="flex-1 rounded bg-white/10 p-2 text-center">
            <div className="text-xs font-medium text-white">💳</div>
            <div className="mt-1 text-xs text-gray-400">Kart</div>
          </div>
          <div className="flex-1 rounded bg-white/10 p-2 text-center">
            <div className="text-xs font-medium text-white">💵</div>
            <div className="mt-1 text-xs text-gray-400">Nakit</div>
          </div>
          <div className="flex-1 rounded bg-white/10 p-2 text-center">
            <div className="text-xs font-medium text-white">📱</div>
            <div className="mt-1 text-xs text-gray-400">Dijital</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
