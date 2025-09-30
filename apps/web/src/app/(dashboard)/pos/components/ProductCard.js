import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'
export const ProductCard = ({ product, onAdd }) => {
  return _jsxs(motion.div, {
    className: `
        glass-card rounded-xl p-4 relative group cursor-pointer transition-all duration-200
        ${
          product.inStock
            ? 'hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-500/30'
            : 'opacity-50 cursor-not-allowed'
        }
      `,
    whileHover: product.inStock ? { y: -2 } : {},
    whileTap: product.inStock ? { scale: 0.98 } : {},
    children: [
      _jsxs('div', {
        className:
          'aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-3 overflow-hidden relative',
        children: [
          product.image
            ? _jsx('img', {
                src: product.image,
                alt: product.name,
                className: 'w-full h-full object-cover',
              })
            : _jsx('div', {
                className: 'w-full h-full flex items-center justify-center',
                children: _jsx('div', {
                  className:
                    'w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center',
                  children: _jsx('span', {
                    className: 'text-primary-400 text-lg font-bold',
                    children: product.name.charAt(0),
                  }),
                }),
              }),
          product.rating &&
            _jsxs('div', {
              className:
                'absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1',
              children: [
                _jsx(Star, {
                  className: 'w-3 h-3 text-yellow-400 fill-current',
                }),
                _jsx('span', {
                  className: 'text-xs text-white font-medium',
                  children: product.rating,
                }),
              ],
            }),
          !product.inStock &&
            _jsx('div', {
              className:
                'absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center',
              children: _jsx('span', {
                className: 'text-white text-sm font-medium',
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
              'text-white font-medium text-sm line-clamp-2 leading-tight',
            children: product.name,
          }),
          product.description &&
            _jsx('p', {
              className: 'text-gray-400 text-xs line-clamp-2',
              children: product.description,
            }),
          _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsx('div', {
                className: 'text-primary-300 font-bold text-lg',
                children: formatCurrency(product.price),
              }),
              product.inStock &&
                _jsx(motion.button, {
                  onClick: (e) => {
                    e.stopPropagation()
                    onAdd(product)
                  },
                  className:
                    'w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors',
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  children: _jsx(Plus, { className: 'w-4 h-4 text-white' }),
                }),
            ],
          }),
        ],
      }),
      product.inStock &&
        _jsx('div', {
          className:
            'absolute inset-0 bg-primary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
        }),
    ],
  })
}
