import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { cn } from '../../lib/utils'
export const Input = React.forwardRef(
  ({ className, error, helperText, ...props }, ref) => {
    return _jsxs('div', {
      className: 'w-full',
      children: [
        _jsx('input', {
          className: cn(
            'border-border flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:ring-brand focus:border-brand focus:ring-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          ),
          ref: ref,
          'aria-invalid': error,
          ...props,
        }),
        helperText &&
          _jsx('p', {
            className: cn(
              'mt-2 text-sm',
              error ? 'text-red-600' : 'text-gray-600'
            ),
            children: helperText,
          }),
      ],
    })
  }
)
Input.displayName = 'Input'
