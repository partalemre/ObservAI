import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
export const DiscountInput = ({ discount, onDiscountChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState(discount?.type || 'percent')
  const [value, setValue] = useState(discount?.value?.toString() || '')
  const handleApply = () => {
    const numValue = parseFloat(value)
    if (numValue > 0) {
      onDiscountChange({ type, value: numValue })
    }
    setIsOpen(false)
  }
  const handleRemove = () => {
    onDiscountChange(undefined)
    setValue('')
    setIsOpen(false)
  }
  const handleCancel = () => {
    if (discount) {
      setType(discount.type)
      setValue(discount.value.toString())
    } else {
      setValue('')
    }
    setIsOpen(false)
  }
  if (!isOpen) {
    return _jsxs('div', {
      className: cn('flex items-center space-x-2', className),
      children: [
        _jsx(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => setIsOpen(true),
          className: 'text-xs',
          children: discount ? 'Edit Discount' : 'Add Discount',
        }),
        discount &&
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: handleRemove,
            className: 'text-xs text-red-600 hover:text-red-700',
            children: 'Remove',
          }),
      ],
    })
  }
  return _jsxs('div', {
    className: cn('space-y-3 rounded-lg border border-gray-200 p-3', className),
    children: [
      _jsxs('div', {
        className: 'flex items-center space-x-2',
        children: [
          _jsx('button', {
            type: 'button',
            onClick: () => setType('percent'),
            className: cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              type === 'percent'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ),
            children: '%',
          }),
          _jsx('button', {
            type: 'button',
            onClick: () => setType('amount'),
            className: cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              type === 'amount'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ),
            children: 'TRY',
          }),
        ],
      }),
      _jsx(Input, {
        type: 'number',
        value: value,
        onChange: (e) => setValue(e.target.value),
        placeholder: type === 'percent' ? 'Enter percentage' : 'Enter amount',
        min: '0',
        step: type === 'percent' ? '0.1' : '0.01',
        max: type === 'percent' ? '100' : undefined,
      }),
      _jsxs('div', {
        className: 'flex items-center justify-end space-x-2',
        children: [
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: handleCancel,
            children: 'Cancel',
          }),
          _jsx(Button, {
            size: 'sm',
            onClick: handleApply,
            disabled: !value || parseFloat(value) <= 0,
            children: 'Apply',
          }),
        ],
      }),
    ],
  })
}
