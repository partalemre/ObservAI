import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const GradientBG = ({ children, className, showGrid = true }) => {
  return _jsxs('div', {
    className: cn('relative overflow-hidden', className),
    children: [
      _jsx('div', {
        className:
          'bg-gradient-radial from-brand/20 absolute inset-0 via-transparent to-transparent',
        style: {
          backgroundImage:
            'radial-gradient(circle at 30% 40%, rgba(54, 124, 150, 0.15) 0%, transparent 50%)',
        },
      }),
      _jsx('div', {
        className:
          'bg-gradient-radial from-accent/10 absolute inset-0 via-transparent to-transparent',
        style: {
          backgroundImage:
            'radial-gradient(circle at 70% 60%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        },
      }),
      showGrid &&
        _jsx('div', {
          className: 'absolute inset-0 opacity-20',
          style: {
            backgroundImage: `
              linear-gradient(rgba(54, 124, 150, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(54, 124, 150, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          },
        }),
      _jsx('div', { className: 'relative z-10', children: children }),
    ],
  })
}
