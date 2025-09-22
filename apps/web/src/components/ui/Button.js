import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  asChild,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand/90 focus:ring-brand',
    secondary:
      'bg-white text-ink border border-border hover:bg-gray-50 focus:ring-brand',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    ghost: 'text-ink hover:bg-ink/5 focus:ring-brand',
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  const Component = asChild ? 'div' : 'button'
  return _jsxs(Component, {
    className: cn(baseClasses, variants[variant], sizes[size], className),
    disabled: disabled || loading,
    ...props,
    children: [
      loading &&
        _jsxs('svg', {
          className: 'mr-2 h-4 w-4 animate-spin',
          fill: 'none',
          viewBox: '0 0 24 24',
          children: [
            _jsx('circle', {
              className: 'opacity-25',
              cx: '12',
              cy: '12',
              r: '10',
              stroke: 'currentColor',
              strokeWidth: '4',
            }),
            _jsx('path', {
              className: 'opacity-75',
              fill: 'currentColor',
              d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
            }),
          ],
        }),
      children,
    ],
  })
}
