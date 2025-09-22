import { jsx as _jsx } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  const variants = {
    default: 'bg-ink/10 text-ink',
    outline: 'border border-border bg-white text-ink',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  }
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  }
  return _jsx('span', {
    className: cn(baseClasses, variants[variant], sizes[size], className),
    children: children,
  })
}
