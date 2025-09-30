import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'
export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta
    if (newQuantity <= 0) {
      onRemove?.(item.id)
    } else {
      onUpdateQuantity?.(item.id, newQuantity)
    }
  }
  return _jsx(motion.div, {
    className: 'bg-white/5 rounded-lg p-3 mb-3 border border-white/10',
    layout: true,
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    children: _jsxs('div', {
      className: 'flex items-start gap-3',
      children: [
        _jsx('div', {
          className:
            'w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0',
          children: item.image
            ? _jsx('img', {
                src: item.image,
                alt: item.name,
                className: 'w-full h-full object-cover',
              })
            : _jsx('div', {
                className: 'w-full h-full flex items-center justify-center',
                children: _jsx('span', {
                  className: 'text-primary-400 text-sm font-bold',
                  children: item.name.charAt(0),
                }),
              }),
        }),
        _jsxs('div', {
          className: 'flex-1 min-w-0',
          children: [
            _jsx('h4', {
              className: 'text-white text-sm font-medium line-clamp-1',
              children: item.name,
            }),
            _jsxs('div', {
              className: 'flex items-center justify-between mt-1',
              children: [
                _jsx('span', {
                  className: 'text-primary-300 text-sm font-semibold',
                  children: formatCurrency(item.price),
                }),
                _jsxs('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    _jsx(motion.button, {
                      onClick: () => handleQuantityChange(-1),
                      className:
                        'w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors',
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      children: _jsx(Minus, {
                        className: 'w-3 h-3 text-white',
                      }),
                    }),
                    _jsx('span', {
                      className:
                        'text-white text-sm font-medium min-w-[1.5rem] text-center',
                      children: item.quantity,
                    }),
                    _jsx(motion.button, {
                      onClick: () => handleQuantityChange(1),
                      className:
                        'w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors',
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      children: _jsx(Plus, { className: 'w-3 h-3 text-white' }),
                    }),
                  ],
                }),
              ],
            }),
            item.notes &&
              _jsx('p', {
                className: 'text-gray-400 text-xs mt-1 line-clamp-2',
                children: item.notes,
              }),
            _jsxs('div', {
              className: 'flex items-center justify-between mt-2',
              children: [
                _jsxs('span', {
                  className: 'text-gray-400 text-xs',
                  children: [
                    'Toplam: ',
                    formatCurrency(item.price * item.quantity),
                  ],
                }),
                _jsx(motion.button, {
                  onClick: () => onRemove?.(item.id),
                  className:
                    'text-red-400 hover:text-red-300 transition-colors',
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  children: _jsx(Trash2, { className: 'w-4 h-4' }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  })
}
