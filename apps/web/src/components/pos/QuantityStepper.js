import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 999,
  className,
}) => {
  const canDecrease = value > min
  const canIncrease = value < max
  const handleDecrease = () => {
    if (canDecrease) {
      onChange(value - 1)
    }
  }
  const handleIncrease = () => {
    if (canIncrease) {
      onChange(value + 1)
    }
  }
  return _jsxs('div', {
    className: cn('flex items-center space-x-2', className),
    children: [
      _jsx('button', {
        type: 'button',
        onClick: handleDecrease,
        disabled: !canDecrease,
        className:
          'flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
        children: _jsx(Minus, { className: 'h-4 w-4' }),
      }),
      _jsx('span', {
        className: 'min-w-[2.5rem] text-center font-medium text-gray-900',
        children: value,
      }),
      _jsx('button', {
        type: 'button',
        onClick: handleIncrease,
        disabled: !canIncrease,
        className:
          'flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
        children: _jsx(Plus, { className: 'h-4 w-4' }),
      }),
    ],
  })
}
