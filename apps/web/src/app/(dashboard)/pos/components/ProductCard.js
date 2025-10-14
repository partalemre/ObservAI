import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'
export const ProductCard = ({ product, onAdd }) => {
  return _jsxs(motion.div, {
    className: `glass-card group relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
      product.inStock
        ? 'hover:shadow-primary-500/10 hover:border-primary-500/30 hover:shadow-lg'
        : 'cursor-not-allowed opacity-50'
    } `,
    whileHover: product.inStock ? { y: -2 } : {},
    whileTap: product.inStock ? { scale: 0.98 } : {},
    children: [
      _jsxs('div', {
        className:
          'relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800',
        children: [
          product.image
            ? _jsx('img', {
                src: product.image,
                alt: product.name,
                className: 'h-full w-full object-cover',
              })
            : _jsx('div', {
                className: 'flex h-full w-full items-center justify-center',
                children: _jsx('div', {
                  className:
                    'bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-full',
                  children: _jsx('span', {
                    className: 'text-primary-400 text-lg font-bold',
                    children: product.name.charAt(0),
                  }),
                }),
              }),
          product.rating &&
            _jsxs('div', {
              className:
                'absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm',
              children: [
                _jsx(Star, {
                  className: 'h-3 w-3 fill-current text-yellow-400',
                }),
                _jsx('span', {
                  className: 'text-xs font-medium text-white',
                  children: product.rating,
                }),
              ],
            }),
          !product.inStock &&
            _jsx('div', {
              className:
                'absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm',
              children: _jsx('span', {
                className: 'text-sm font-medium text-white',
                children: 'T\u00FCkendi',
              }),
            }),
        ],
      }),
      _jsxs('div', {
        className: 'space-y-2',
        children: [
          _jsx('h3', {
            className:
              'line-clamp-2 text-sm leading-tight font-medium text-white',
            children: product.name,
          }),
          product.description &&
            _jsx('p', {
              className: 'line-clamp-2 text-xs text-gray-400',
              children: product.description,
            }),
          _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsx('div', {
                className: 'text-primary-300 text-lg font-bold',
                children: formatCurrency(product.price),
              }),
              product.inStock &&
                _jsx(motion.button, {
                  onClick: (e) => {
                    e.stopPropagation()
                    onAdd(product)
                  },
                  className:
                    'bg-primary-500 hover:bg-primary-600 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  children: _jsx(Plus, { className: 'h-4 w-4 text-white' }),
                }),
            ],
          }),
        ],
      }),
      product.inStock &&
        _jsx('div', {
          className:
            'bg-primary-500/5 pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        }),
    ],
  })
}
