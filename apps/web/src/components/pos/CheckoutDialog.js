import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { formatCurrency } from '../../lib/format'
import { usePOS } from '../../store/posStore'
import { useCreateOrder } from '../../features/pos/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
export const CheckoutDialog = ({ open, onClose }) => {
  const { selectedStoreId } = useOrgStore()
  const { lines, discount, note, totals, clear } = usePOS()
  const createOrderMutation = useCreateOrder()
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cashGiven, setCashGiven] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { subtotal, discountTotal, tax, total } = totals()
  const cashAmount = parseFloat(cashGiven) || 0
  const change = Math.max(0, cashAmount - total)
  const canSubmit =
    paymentMethod === 'card' ||
    (paymentMethod === 'cash' && cashAmount >= total)
  const handleQuickCash = (amount) => {
    setCashGiven(amount.toString())
  }
  const handleSubmit = async () => {
    if (!selectedStoreId || !canSubmit) return
    setIsSubmitting(true)
    try {
      const orderData = {
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
  return _jsx(Modal, {
    open: open,
    onClose: handleClose,
    className: 'max-w-md',
    children: _jsxs('div', {
      className: 'space-y-6',
      children: [
        _jsx('div', {
          children: _jsx('h2', {
            className: 'text-xl font-semibold text-gray-900',
            children: t('pos.checkout'),
          }),
        }),
        _jsxs('div', {
          className: 'space-y-2 rounded-lg bg-gray-50 p-4',
          children: [
            _jsxs('div', {
              className: 'flex justify-between text-sm',
              children: [
                _jsx('span', {
                  className: 'text-gray-600',
                  children: t('pos.subtotal'),
                }),
                _jsx('span', {
                  children: formatCurrency(subtotal, 'en-US', 'TRY'),
                }),
              ],
            }),
            discountTotal > 0 &&
              _jsxs('div', {
                className: 'flex justify-between text-sm',
                children: [
                  _jsx('span', {
                    className: 'text-gray-600',
                    children: t('pos.discount'),
                  }),
                  _jsxs('span', {
                    className: 'text-red-600',
                    children: [
                      '-',
                      formatCurrency(discountTotal, 'en-US', 'TRY'),
                    ],
                  }),
                ],
              }),
            tax > 0 &&
              _jsxs('div', {
                className: 'flex justify-between text-sm',
                children: [
                  _jsx('span', {
                    className: 'text-gray-600',
                    children: t('pos.tax'),
                  }),
                  _jsx('span', {
                    children: formatCurrency(tax, 'en-US', 'TRY'),
                  }),
                ],
              }),
            _jsxs('div', {
              className: 'flex justify-between border-t pt-2 font-semibold',
              children: [
                _jsx('span', { children: t('pos.total') }),
                _jsx('span', {
                  className: 'text-brand text-lg',
                  children: formatCurrency(total, 'en-US', 'TRY'),
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsx('h3', {
              className: 'font-medium text-gray-900',
              children: t('pos.method'),
            }),
            _jsxs('div', {
              className: 'flex space-x-2',
              children: [
                _jsx('button', {
                  type: 'button',
                  onClick: () => setPaymentMethod('cash'),
                  className: `flex-1 rounded-lg border-2 p-3 text-center font-medium transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`,
                  children: t('pos.cash'),
                }),
                _jsx('button', {
                  type: 'button',
                  onClick: () => setPaymentMethod('card'),
                  className: `flex-1 rounded-lg border-2 p-3 text-center font-medium transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`,
                  children: t('pos.card'),
                }),
              ],
            }),
          ],
        }),
        paymentMethod === 'cash' &&
          _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsxs('div', {
                children: [
                  _jsx('label', {
                    htmlFor: 'cashGiven',
                    className: 'mb-2 block text-sm font-medium text-gray-700',
                    children: t('pos.cashGiven'),
                  }),
                  _jsx(Input, {
                    id: 'cashGiven',
                    type: 'number',
                    value: cashGiven,
                    onChange: (e) => setCashGiven(e.target.value),
                    placeholder: '0.00',
                    min: '0',
                    step: '0.01',
                  }),
                ],
              }),
              _jsx('div', {
                className: 'flex space-x-2',
                children: [50, 100, 200].map((amount) =>
                  _jsxs(
                    Button,
                    {
                      variant: 'outline',
                      size: 'sm',
                      onClick: () => handleQuickCash(amount),
                      className: 'flex-1',
                      children: [amount, ' TRY'],
                    },
                    amount
                  )
                ),
              }),
              cashAmount > 0 &&
                _jsx('div', {
                  className: 'rounded-lg bg-green-50 p-3',
                  children: _jsxs('div', {
                    className: 'flex justify-between',
                    children: [
                      _jsx('span', {
                        className: 'font-medium text-green-800',
                        children: t('pos.change'),
                      }),
                      _jsx('span', {
                        className: 'font-semibold text-green-900',
                        children: formatCurrency(change, 'en-US', 'TRY'),
                      }),
                    ],
                  }),
                }),
            ],
          }),
        _jsxs('div', {
          className: 'flex items-center justify-between border-t pt-4',
          children: [
            _jsx(Button, {
              variant: 'outline',
              onClick: handleClose,
              disabled: isSubmitting,
              children: 'Cancel',
            }),
            _jsx(Button, {
              onClick: handleSubmit,
              disabled: !canSubmit || isSubmitting,
              className: 'min-w-[120px]',
              children: isSubmitting
                ? 'Processing...'
                : t('pos.confirmPayment'),
            }),
          ],
        }),
      ],
    }),
  })
}
