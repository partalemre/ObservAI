import React from 'react'
interface StepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}
export declare const Stepper: React.FC<StepperProps>
export {}
