import { jsx as _jsx } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const Card = ({ children, className, padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return _jsx('div', {
    className: cn(
      'border-border rounded-2xl border bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
      paddingClasses[padding],
      className
    ),
    children: children,
  })
}
