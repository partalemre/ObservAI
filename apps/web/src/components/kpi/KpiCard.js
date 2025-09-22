import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const KpiCard = ({ label, value, helper, className }) => {
  return _jsx('div', {
    className: cn(
      'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
      className
    ),
    children: _jsx('div', {
      className: 'flex items-center',
      children: _jsxs('div', {
        className: 'flex-1',
        children: [
          _jsx('p', {
            className: 'text-sm font-medium text-gray-600',
            children: label,
          }),
          _jsx('p', {
            className: 'mt-1 text-2xl font-bold text-gray-900',
            children: value,
          }),
          helper &&
            _jsx('p', {
              className: 'mt-1 text-xs text-gray-500',
              children: helper,
            }),
        ],
      }),
    }),
  })
}
