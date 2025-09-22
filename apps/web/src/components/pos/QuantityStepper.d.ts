import React from 'react'
interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}
export declare const QuantityStepper: React.FC<QuantityStepperProps>
export {}
