import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useOpenDrawer } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'
export const OpenDrawerDialog = ({ open, onClose, storeId }) => {
  const [floatAmount, setFloatAmount] = useState('')
  const openDrawerMutation = useOpenDrawer(storeId)
  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(floatAmount)
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount')
      return
    }
    openDrawerMutation.mutate(
      { storeId, floatAmount: amount },
      {
        onSuccess: () => {
          toast.success(t('payments.success.opened'))
          setFloatAmount('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to open drawer')
        },
      }
    )
  }
  return _jsxs(Modal, {
    open: open,
    onClose: onClose,
    children: [
      _jsx(Title, {
        level: 2,
        className: 'mb-4',
        children: t('payments.open.title'),
      }),
      _jsxs('form', {
        onSubmit: handleSubmit,
        className: 'space-y-4',
        children: [
          _jsxs('div', {
            children: [
              _jsx(Label, {
                htmlFor: 'float-amount',
                children: t('payments.open.float'),
              }),
              _jsx(Input, {
                id: 'float-amount',
                type: 'number',
                step: '0.01',
                min: '0',
                value: floatAmount,
                onChange: (e) => setFloatAmount(e.target.value),
                placeholder: '0.00',
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
                disabled: openDrawerMutation.isPending,
                children: t('payments.actions.cancel'),
              }),
              _jsx(Button, {
                type: 'submit',
                loading: openDrawerMutation.isPending,
                children: t('payments.actions.open'),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
