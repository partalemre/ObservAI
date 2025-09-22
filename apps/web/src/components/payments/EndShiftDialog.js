import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useCloseDrawer, useDrawer } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'
export const EndShiftDialog = ({ open, onClose, storeId }) => {
  const [countedTotal, setCountedTotal] = useState('')
  const { data: drawer } = useDrawer(storeId)
  const closeDrawerMutation = useCloseDrawer(storeId)
  const handleSubmit = (e) => {
    e.preventDefault()
    const total = parseFloat(countedTotal)
    if (isNaN(total) || total < 0) {
      toast.error('Please enter a valid counted total')
      return
    }
    closeDrawerMutation.mutate(
      {
        storeId,
        countedBy: 'clerk', // In a real app, this would be the current user
        countedTotal: total,
      },
      {
        onSuccess: () => {
          toast.success(t('payments.success.closed'))
          setCountedTotal('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to close drawer')
        },
      }
    )
  }
  const systemBalance = drawer?.balance || 0
  const countedValue = parseFloat(countedTotal) || 0
  const difference = countedValue - systemBalance
  return _jsxs(Modal, {
    open: open,
    onClose: onClose,
    className: 'max-w-lg',
    children: [
      _jsx(Title, {
        level: 2,
        className: 'mb-4',
        children: t('payments.close.title'),
      }),
      _jsxs('div', {
        className: 'mb-6 rounded-lg bg-gray-50 p-4',
        children: [
          _jsxs('div', {
            className: 'mb-2 flex items-center justify-between',
            children: [
              _jsx('span', {
                className: 'text-sm text-gray-600',
                children: 'System Balance:',
              }),
              _jsxs('span', {
                className: 'font-medium',
                children: ['$', systemBalance.toFixed(2)],
              }),
            ],
          }),
          countedTotal &&
            _jsxs('div', {
              className: 'mb-2 flex items-center justify-between',
              children: [
                _jsx('span', {
                  className: 'text-sm text-gray-600',
                  children: 'Counted Total:',
                }),
                _jsxs('span', {
                  className: 'font-medium',
                  children: ['$', countedValue.toFixed(2)],
                }),
              ],
            }),
          countedTotal &&
            difference !== 0 &&
            _jsxs('div', {
              className: 'mt-2 flex items-center justify-between border-t pt-2',
              children: [
                _jsx('span', {
                  className: 'text-sm text-gray-600',
                  children: 'Difference:',
                }),
                _jsxs('span', {
                  className: `font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`,
                  children: [
                    difference > 0 ? '+' : '',
                    '$',
                    difference.toFixed(2),
                  ],
                }),
              ],
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
                htmlFor: 'counted-total',
                children: t('payments.close.counted'),
              }),
              _jsx(Input, {
                id: 'counted-total',
                type: 'number',
                step: '0.01',
                min: '0',
                value: countedTotal,
                onChange: (e) => setCountedTotal(e.target.value),
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
                disabled: closeDrawerMutation.isPending,
                children: t('payments.actions.cancel'),
              }),
              _jsx(Button, {
                type: 'submit',
                loading: closeDrawerMutation.isPending,
                children: t('payments.close.submit'),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
