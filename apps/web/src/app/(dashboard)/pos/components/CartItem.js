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
    className: 'mb-3 rounded-lg border border-white/10 bg-white/5 p-3',
    layout: true,
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    children: _jsxs('div', {
      className: 'flex items-start gap-3',
      children: [
        _jsx('div', {
          className:
            'h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800',
          children: item.image
            ? _jsx('img', {
                src: item.image,
                alt: item.name,
                className: 'h-full w-full object-cover',
              })
            : _jsx('div', {
                className: 'flex h-full w-full items-center justify-center',
                children: _jsx('span', {
                  className: 'text-primary-400 text-sm font-bold',
                  children: item.name.charAt(0),
                }),
              }),
        }),
        _jsxs('div', {
          className: 'min-w-0 flex-1',
          children: [
            _jsx('h4', {
              className: 'line-clamp-1 text-sm font-medium text-white',
              children: item.name,
            }),
            _jsxs('div', {
              className: 'mt-1 flex items-center justify-between',
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
                        'flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20',
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      children: _jsx(Minus, {
                        className: 'h-3 w-3 text-white',
                      }),
                    }),
                    _jsx('span', {
                      className:
                        'min-w-[1.5rem] text-center text-sm font-medium text-white',
                      children: item.quantity,
                    }),
                    _jsx(motion.button, {
                      onClick: () => handleQuantityChange(1),
                      className:
                        'flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20',
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      children: _jsx(Plus, { className: 'h-3 w-3 text-white' }),
                    }),
                  ],
                }),
              ],
            }),
            item.notes &&
              _jsx('p', {
                className: 'mt-1 line-clamp-2 text-xs text-gray-400',
                children: item.notes,
              }),
            _jsxs('div', {
              className: 'mt-2 flex items-center justify-between',
              children: [
                _jsxs('span', {
                  className: 'text-xs text-gray-400',
                  children: [
                    'Toplam: ',
                    formatCurrency(item.price * item.quantity),
                  ],
                }),
                _jsx(motion.button, {
                  onClick: () => onRemove?.(item.id),
                  className:
                    'text-red-400 transition-colors hover:text-red-300',
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  children: _jsx(Trash2, { className: 'h-4 w-4' }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  })
}
