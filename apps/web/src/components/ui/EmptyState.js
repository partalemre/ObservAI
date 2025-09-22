import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const EmptyState = ({ icon, title, description, action, className }) => {
  return _jsxs('div', {
    className: cn('px-4 py-12 text-center', className),
    children: [
      icon &&
        _jsx('div', {
          className: 'mx-auto mb-4 h-12 w-12 text-gray-400',
          children: icon,
        }),
      _jsx('h3', {
        className: 'mb-2 text-lg font-medium text-gray-900',
        children: title,
      }),
      description &&
        _jsx('p', {
          className: 'mx-auto mb-6 max-w-sm text-gray-500',
          children: description,
        }),
      action && _jsx('div', { children: action }),
    ],
  })
}
