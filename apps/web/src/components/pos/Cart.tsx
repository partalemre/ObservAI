import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { QuantityStepper } from './QuantityStepper'
import { DiscountInput } from './DiscountInput'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
import { usePOS } from '../../store/posStore'
import { t } from '../../lib/i18n'

interface CartProps {
  className?: string
  onCheckout: () => void
}

export const Cart: React.FC<CartProps> = ({ className, onCheckout }) => {
  const { lines, discount, updateQty, removeLine, setDiscount, clear, totals } =
    usePOS()
  const { subtotal, discountTotal, tax, total } = totals()

  if (lines.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          className="text-red-600 hover:text-red-700"
        >
          {t('pos.clear')}
        </Button>
      </div>

      {/* Cart Items */}
      <div className="max-h-64 space-y-3 overflow-y-auto">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center justify-between space-x-3 rounded-lg border border-gray-200 p-3"
          >
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-medium text-gray-900">
                {line.name}
              </h4>
              {line.modifiers && line.modifiers.length > 0 && (
                <div className="mt-1 space-y-1">
                  {line.modifiers.map((mod, idx) => (
                    <p key={idx} className="text-xs text-gray-600">
                      + {mod.name}{' '}
                      {mod.priceDelta > 0 &&
                        `(+${formatCurrency(mod.priceDelta, 'en-US', 'TRY')})`}
                    </p>
                  ))}
                </div>
              )}
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(line.unitPrice, 'en-US', 'TRY')} each
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <QuantityStepper
                value={line.qty}
                onChange={(qty) => updateQty(line.id, qty)}
                min={1}
              />
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Discount */}
      <div>
        <DiscountInput discount={discount} onDiscountChange={setDiscount} />
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('pos.subtotal')}</span>
          <span className="font-medium">
            {formatCurrency(subtotal, 'en-US', 'TRY')}
          </span>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('pos.discount')}</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(discountTotal, 'en-US', 'TRY')}
            </span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('pos.tax')}</span>
            <span className="font-medium">
              {formatCurrency(tax, 'en-US', 'TRY')}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t pt-2">
          <span className="font-semibold text-gray-900">{t('pos.total')}</span>
          <span className="font-display text-brand text-xl font-bold">
            {formatCurrency(total, 'en-US', 'TRY')}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        className="w-full"
        disabled={lines.length === 0}
      >
        {t('pos.checkout')}
      </Button>
    </div>
  )
}
