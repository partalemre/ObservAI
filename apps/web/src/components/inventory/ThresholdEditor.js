import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime'
import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
export const ThresholdEditor = ({
  item,
  onUpdate,
  disabled = false,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [minQty, setMinQty] = useState(item.minQty)
  const [reorderQty, setReorderQty] = useState(item.reorderQty || 0)
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(item.id, { minQty, reorderQty })
    }
    setIsEditing(false)
  }
  const handleCancel = () => {
    setMinQty(item.minQty)
    setReorderQty(item.reorderQty || 0)
    setIsEditing(false)
  }
  if (disabled || item.stockQty <= 0) {
    return _jsxs('div', {
      className: cn('text-gray-400', className),
      children: [
        _jsxs('div', {
          className: 'text-sm',
          children: ['Min: ', item.minQty],
        }),
        _jsxs('div', {
          className: 'text-sm',
          children: ['Reorder: ', item.reorderQty || '-'],
        }),
      ],
    })
  }
  if (!isEditing) {
    return _jsx('div', {
      className: cn('group', className),
      children: _jsxs('div', {
        className: 'flex items-center gap-2',
        children: [
          _jsxs('div', {
            children: [
              _jsxs('div', {
                className: 'text-sm text-gray-600',
                children: ['Min: ', item.minQty],
              }),
              _jsxs('div', {
                className: 'text-sm text-gray-600',
                children: ['Reorder: ', item.reorderQty || '-'],
              }),
            ],
          }),
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: () => setIsEditing(true),
            className: 'opacity-0 transition-opacity group-hover:opacity-100',
            children: _jsx(Edit2, { className: 'h-3 w-3' }),
          }),
        ],
      }),
    })
  }
  return _jsxs('div', {
    className: cn('space-y-2', className),
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-1',
        children: [
          _jsx('span', {
            className: 'w-8 text-xs text-gray-500',
            children: 'Min:',
          }),
          _jsx(Input, {
            type: 'number',
            value: minQty,
            onChange: (e) => setMinQty(parseInt(e.target.value) || 0),
            min: '0',
            className: 'h-7 w-16 text-xs',
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-center gap-1',
        children: [
          _jsx('span', {
            className: 'w-8 text-xs text-gray-500',
            children: 'Rec:',
          }),
          _jsx(Input, {
            type: 'number',
            value: reorderQty,
            onChange: (e) => setReorderQty(parseInt(e.target.value) || 0),
            min: '0',
            className: 'h-7 w-16 text-xs',
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-center gap-1',
        children: [
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: handleSave,
            className: 'h-6 w-6 p-0 text-green-600 hover:text-green-700',
            children: _jsx(Check, { className: 'h-3 w-3' }),
          }),
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: handleCancel,
            className: 'h-6 w-6 p-0 text-red-600 hover:text-red-700',
            children: _jsx(X, { className: 'h-3 w-3' }),
          }),
        ],
      }),
    ],
  })
}
