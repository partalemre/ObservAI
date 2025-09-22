import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 0,
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

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={!canDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="min-w-[2rem] text-center font-medium text-gray-900">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={!canIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
