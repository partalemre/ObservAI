import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import React from 'react'
import { cn } from '../../lib/utils'
export const Label = React.forwardRef(
  ({ className, children, required, ...props }, ref) => {
    return _jsxs('label', {
      ref: ref,
      className: cn(
        'text-ink text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      ),
      ...props,
      children: [
        children,
        required &&
          _jsx('span', { className: 'ml-1 text-red-500', children: '*' }),
      ],
    })
  }
)
Label.displayName = 'Label'
