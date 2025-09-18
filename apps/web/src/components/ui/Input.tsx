import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            'border-border flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:ring-brand focus:border-brand focus:ring-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          aria-invalid={error}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-2 text-sm',
              error ? 'text-red-600' : 'text-gray-600'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
