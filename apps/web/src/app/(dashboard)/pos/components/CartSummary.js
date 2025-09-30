import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { Receipt, Percent, Gift } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'
export const CartSummary = ({ cart, discount = 0, tax = 0.18 }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * tax
  const total = taxableAmount + taxAmount
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  return _jsxs(motion.div, {
    className: 'space-y-3',
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 },
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between text-sm',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsx(Receipt, { className: 'w-4 h-4 text-gray-400' }),
              _jsx('span', {
                className: 'text-gray-400',
                children: '\u00DCr\u00FCn Say\u0131s\u0131',
              }),
            ],
          }),
          _jsxs('span', {
            className: 'text-white font-medium',
            children: [itemCount, ' adet'],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-center justify-between text-sm',
        children: [
          _jsx('span', { className: 'text-gray-400', children: 'Ara Toplam' }),
          _jsx('span', {
            className: 'text-white font-medium',
            children: formatCurrency(subtotal),
          }),
        ],
      }),
      discount > 0 &&
        _jsxs('div', {
          className: 'flex items-center justify-between text-sm',
          children: [
            _jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                _jsx(Percent, { className: 'w-4 h-4 text-green-400' }),
                _jsxs('span', {
                  className: 'text-green-400',
                  children: ['\u0130ndirim (%', discount, ')'],
                }),
              ],
            }),
            _jsxs('span', {
              className: 'text-green-400 font-medium',
              children: ['-', formatCurrency(discountAmount)],
            }),
          ],
        }),
      _jsxs('div', {
        className: 'flex items-center justify-between text-sm',
        children: [
          _jsxs('span', {
            className: 'text-gray-400',
            children: ['KDV (%', (tax * 100).toFixed(0), ')'],
          }),
          _jsx('span', {
            className: 'text-white font-medium',
            children: formatCurrency(taxAmount),
          }),
        ],
      }),
      _jsx('div', { className: 'border-t border-white/10 my-3' }),
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('span', {
            className: 'text-lg font-semibold text-white',
            children: 'Toplam',
          }),
          _jsx('span', {
            className: 'text-xl font-bold text-primary-300',
            children: formatCurrency(total),
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex gap-2 mt-4',
        children: [
          _jsxs(motion.button, {
            className:
              'flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2',
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: [_jsx(Percent, { className: 'w-3 h-3' }), '\u0130ndirim'],
          }),
          _jsxs(motion.button, {
            className:
              'flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2',
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: [_jsx(Gift, { className: 'w-3 h-3' }), 'Kupon'],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'mt-4 p-3 bg-white/5 rounded-lg',
        children: [
          _jsx('div', {
            className: 'text-xs text-gray-400 mb-2',
            children: '\u00D6deme Se\u00E7enekleri',
          }),
          _jsxs('div', {
            className: 'flex gap-2',
            children: [
              _jsxs('div', {
                className: 'flex-1 p-2 bg-white/10 rounded text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs text-white font-medium',
                    children: '\uD83D\uDCB3',
                  }),
                  _jsx('div', {
                    className: 'text-xs text-gray-400 mt-1',
                    children: 'Kart',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex-1 p-2 bg-white/10 rounded text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs text-white font-medium',
                    children: '\uD83D\uDCB5',
                  }),
                  _jsx('div', {
                    className: 'text-xs text-gray-400 mt-1',
                    children: 'Nakit',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex-1 p-2 bg-white/10 rounded text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs text-white font-medium',
                    children: '\uD83D\uDCF1',
                  }),
                  _jsx('div', {
                    className: 'text-xs text-gray-400 mt-1',
                    children: 'Dijital',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
