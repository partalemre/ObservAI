import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { formatCurrency } from '../../lib/format'
import { usePOS } from '../../store/posStore'
import { useCreateOrder } from '../../features/pos/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
import type { NewOrder } from '../../features/pos/types'

interface CheckoutDialogProps {
  open: boolean
  onClose: () => void
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
}) => {
  const { selectedStoreId } = useOrgStore()
  const { lines, discount, note, totals, clear } = usePOS()
  const createOrderMutation = useCreateOrder()

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [cashGiven, setCashGiven] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { subtotal, discountTotal, tax, total } = totals()
  const cashAmount = parseFloat(cashGiven) || 0
  const change = Math.max(0, cashAmount - total)
  const canSubmit =
    paymentMethod === 'card' ||
    (paymentMethod === 'cash' && cashAmount >= total)

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount.toString())
  }

  const handleSubmit = async () => {
    if (!selectedStoreId || !canSubmit) return

    setIsSubmitting(true)

    try {
      const orderData: NewOrder = {
        storeId: selectedStoreId,
        lines: lines.map((line) => ({
          itemId: line.itemId,
          name: line.name,
          qty: line.qty,
          unitPrice: line.unitPrice,
          modifiers: line.modifiers,
          lineTotal: line.unitPrice * line.qty,
        })),
        discounts: discount ? [discount] : undefined,
        payments: [
          {
            method: paymentMethod,
            amount: paymentMethod === 'cash' ? cashAmount : total,
            change: paymentMethod === 'cash' ? change : 0,
          },
        ],
        subtotal,
        discountTotal,
        tax,
        total,
        note,
      }

      const response = await createOrderMutation.mutateAsync(orderData)

      toast.success(`${t('pos.orderSuccess')} #${response.orderId}`)
      clear()
      onClose()

      // Reset form
      setCashGiven('')
      setPaymentMethod('cash')
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error(t('common.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setCashGiven('')
      setPaymentMethod('cash')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-md">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('pos.checkout')}
          </h2>
        </div>

        {/* Order Summary */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('pos.subtotal')}</span>
            <span>{formatCurrency(subtotal, 'en-US', 'TRY')}</span>
          </div>

          {discountTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('pos.discount')}</span>
              <span className="text-red-600">
                -{formatCurrency(discountTotal, 'en-US', 'TRY')}
              </span>
            </div>
          )}

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('pos.tax')}</span>
              <span>{formatCurrency(tax, 'en-US', 'TRY')}</span>
            </div>
          )}

          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>{t('pos.total')}</span>
            <span className="text-brand text-lg">
              {formatCurrency(total, 'en-US', 'TRY')}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">{t('pos.method')}</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 rounded-lg border-2 p-3 text-center font-medium transition-colors ${
                paymentMethod === 'cash'
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('pos.cash')}
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 rounded-lg border-2 p-3 text-center font-medium transition-colors ${
                paymentMethod === 'card'
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('pos.card')}
            </button>
          </div>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cashGiven"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t('pos.cashGiven')}
              </label>
              <Input
                id="cashGiven"
                type="number"
                value={cashGiven}
                onChange={(e) => setCashGiven(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Quick Cash Buttons */}
            <div className="flex space-x-2">
              {[50, 100, 200].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickCash(amount)}
                  className="flex-1"
                >
                  {amount} TRY
                </Button>
              ))}
            </div>

            {/* Change */}
            {cashAmount > 0 && (
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex justify-between">
                  <span className="font-medium text-green-800">
                    {t('pos.change')}
                  </span>
                  <span className="font-semibold text-green-900">
                    {formatCurrency(change, 'en-US', 'TRY')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Processing...' : t('pos.confirmPayment')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
