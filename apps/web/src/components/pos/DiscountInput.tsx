import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
import type { Discount } from '../../features/pos/types'

interface DiscountInputProps {
  discount?: Discount
  onDiscountChange: (discount?: Discount) => void
  className?: string
}

export const DiscountInput: React.FC<DiscountInputProps> = ({
  discount,
  onDiscountChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'percent' | 'amount'>(
    discount?.type || 'percent'
  )
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
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-xs"
        >
          {discount ? 'Edit Discount' : 'Add Discount'}
        </Button>
        {discount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Remove
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border border-gray-200 p-3',
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setType('percent')}
          className={cn(
            'rounded px-3 py-1 text-sm font-medium transition-colors',
            type === 'percent'
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          %
        </button>
        <button
          type="button"
          onClick={() => setType('amount')}
          className={cn(
            'rounded px-3 py-1 text-sm font-medium transition-colors',
            type === 'amount'
              ? 'bg-brand text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          TRY
        </button>
      </div>

      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={type === 'percent' ? 'Enter percentage' : 'Enter amount'}
        min="0"
        step={type === 'percent' ? '0.1' : '0.01'}
        max={type === 'percent' ? '100' : undefined}
      />

      <div className="flex items-center justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          disabled={!value || parseFloat(value) <= 0}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
