import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
export const ProductCard = ({ item, onClick, className }) => {
  const handleClick = () => {
    onClick(item)
  }
  return _jsxs('button', {
    type: 'button',
    onClick: handleClick,
    className: cn(
      'group hover:border-brand focus:border-brand focus:ring-brand/20 w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:shadow-md focus:ring-2 focus:outline-none',
      className
    ),
    children: [
      item.imageUrl
        ? _jsx('img', {
            src: item.imageUrl,
            alt: item.name,
            className: 'mb-3 h-32 w-full rounded-lg bg-gray-100 object-cover',
          })
        : _jsx('div', {
            className:
              'mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-gray-100',
            children: _jsx('span', {
              className: 'text-2xl text-gray-400',
              children: '\uD83C\uDF7D\uFE0F',
            }),
          }),
      _jsxs('div', {
        className: 'space-y-1',
        children: [
          _jsx('h3', {
            className:
              'group-hover:text-brand font-medium text-gray-900 transition-colors',
            children: item.name,
          }),
          _jsx('p', {
            className: 'text-brand text-lg font-semibold',
            children: formatCurrency(item.price, 'en-US', 'TRY'),
          }),
          item.sku &&
            _jsxs('p', {
              className: 'text-xs text-gray-500',
              children: ['SKU: ', item.sku],
            }),
        ],
      }),
    ],
  })
}
