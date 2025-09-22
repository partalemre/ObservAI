import { jsx as _jsx } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const Title = ({ children, level = 1, className }) => {
  const Component = `h${level}`
  const levelClasses = {
    1: 'text-4xl font-display font-bold text-ink tracking-tight',
    2: 'text-3xl font-display font-bold text-ink tracking-tight',
    3: 'text-2xl font-display font-semibold text-ink tracking-tight',
    4: 'text-xl font-display font-semibold text-ink tracking-tight',
    5: 'text-lg font-display font-semibold text-ink tracking-tight',
    6: 'text-base font-display font-semibold text-ink tracking-tight',
  }
  return _jsx(Component, {
    className: cn(levelClasses[level], className),
    children: children,
  })
}
