import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useCashIn, useCashOut } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'
export const CashInOutDialog = ({ open, onClose, storeId }) => {
  const [mode, setMode] = useState('in')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const cashInMutation = useCashIn(storeId)
  const cashOutMutation = useCashOut(storeId)
  const handleSubmit = (e) => {
    e.preventDefault()
    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }
    const mutation = mode === 'in' ? cashInMutation : cashOutMutation
    const successMessage =
      mode === 'in'
        ? t('payments.success.cashedIn')
        : t('payments.success.cashedOut')
    mutation.mutate(
      { storeId, amount: amountValue, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(successMessage)
          setAmount('')
          setReason('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to process cash transaction')
        },
      }
    )
  }
  const isPending = cashInMutation.isPending || cashOutMutation.isPending
  return _jsxs(Modal, {
    open: open,
    onClose: onClose,
    children: [
      _jsx(Title, {
        level: 2,
        className: 'mb-4',
        children:
          mode === 'in'
            ? t('payments.inout.titleIn')
            : t('payments.inout.titleOut'),
      }),
      _jsxs('div', {
        className: 'mb-4 flex rounded-lg bg-gray-100 p-1',
        children: [
          _jsx('button', {
            type: 'button',
            className: `flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'in'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setMode('in'),
            children: t('payments.actions.cashIn'),
          }),
          _jsx('button', {
            type: 'button',
            className: `flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'out'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setMode('out'),
            children: t('payments.actions.cashOut'),
          }),
        ],
      }),
      _jsxs('form', {
        onSubmit: handleSubmit,
        className: 'space-y-4',
        children: [
          _jsxs('div', {
            children: [
              _jsx(Label, {
                htmlFor: 'amount',
                children: t('payments.inout.amount'),
              }),
              _jsx(Input, {
                id: 'amount',
                type: 'number',
                step: '0.01',
                min: '0.01',
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                placeholder: '0.00',
                required: true,
              }),
            ],
          }),
          _jsxs('div', {
            children: [
              _jsx(Label, {
                htmlFor: 'reason',
                children: t('payments.inout.reason'),
              }),
              _jsx(Input, {
                id: 'reason',
                value: reason,
                onChange: (e) => setReason(e.target.value),
                placeholder: 'Enter reason...',
                required: true,
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex gap-2 pt-4',
            children: [
              _jsx(Button, {
                type: 'button',
                variant: 'secondary',
                onClick: onClose,
                disabled: isPending,
                children: t('payments.actions.cancel'),
              }),
              _jsx(Button, {
                type: 'submit',
                loading: isPending,
                children: t('payments.actions.confirm'),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
