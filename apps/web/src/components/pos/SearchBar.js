import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search products…',
  className,
}) => {
  const handleClear = () => {
    onChange('')
  }
  return _jsxs('div', {
    className: cn('relative', className),
    children: [
      _jsx('div', {
        className: 'absolute inset-y-0 left-0 flex items-center pl-3',
        children: _jsx(Search, { className: 'h-5 w-5 text-gray-400' }),
      }),
      _jsx('input', {
        type: 'text',
        value: value,
        onChange: (e) => onChange(e.target.value),
        placeholder: placeholder,
        className:
          'focus:border-brand focus:ring-brand block w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none',
      }),
      value &&
        _jsx('button', {
          type: 'button',
          onClick: handleClear,
          className: 'absolute inset-y-0 right-0 flex items-center pr-3',
          children: _jsx(X, {
            className: 'h-5 w-5 text-gray-400 hover:text-gray-600',
          }),
        }),
    ],
  })
}
