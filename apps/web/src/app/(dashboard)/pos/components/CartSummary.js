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
              _jsx(Receipt, { className: 'h-4 w-4 text-gray-400' }),
              _jsx('span', {
                className: 'text-gray-400',
                children: '\u00DCr\u00FCn Say\u0131s\u0131',
              }),
            ],
          }),
          _jsxs('span', {
            className: 'font-medium text-white',
            children: [itemCount, ' adet'],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-center justify-between text-sm',
        children: [
          _jsx('span', { className: 'text-gray-400', children: 'Ara Toplam' }),
          _jsx('span', {
            className: 'font-medium text-white',
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
                _jsx(Percent, { className: 'h-4 w-4 text-green-400' }),
                _jsxs('span', {
                  className: 'text-green-400',
                  children: ['\u0130ndirim (%', discount, ')'],
                }),
              ],
            }),
            _jsxs('span', {
              className: 'font-medium text-green-400',
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
            className: 'font-medium text-white',
            children: formatCurrency(taxAmount),
          }),
        ],
      }),
      _jsx('div', { className: 'my-3 border-t border-white/10' }),
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('span', {
            className: 'text-lg font-semibold text-white',
            children: 'Toplam',
          }),
          _jsx('span', {
            className: 'text-primary-300 text-xl font-bold',
            children: formatCurrency(total),
          }),
        ],
      }),
      _jsxs('div', {
        className: 'mt-4 flex gap-2',
        children: [
          _jsxs(motion.button, {
            className:
              'flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white',
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: [_jsx(Percent, { className: 'h-3 w-3' }), '\u0130ndirim'],
          }),
          _jsxs(motion.button, {
            className:
              'flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white',
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: [_jsx(Gift, { className: 'h-3 w-3' }), 'Kupon'],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'mt-4 rounded-lg bg-white/5 p-3',
        children: [
          _jsx('div', {
            className: 'mb-2 text-xs text-gray-400',
            children: '\u00D6deme Se\u00E7enekleri',
          }),
          _jsxs('div', {
            className: 'flex gap-2',
            children: [
              _jsxs('div', {
                className: 'flex-1 rounded bg-white/10 p-2 text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs font-medium text-white',
                    children: '\uD83D\uDCB3',
                  }),
                  _jsx('div', {
                    className: 'mt-1 text-xs text-gray-400',
                    children: 'Kart',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex-1 rounded bg-white/10 p-2 text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs font-medium text-white',
                    children: '\uD83D\uDCB5',
                  }),
                  _jsx('div', {
                    className: 'mt-1 text-xs text-gray-400',
                    children: 'Nakit',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex-1 rounded bg-white/10 p-2 text-center',
                children: [
                  _jsx('div', {
                    className: 'text-xs font-medium text-white',
                    children: '\uD83D\uDCF1',
                  }),
                  _jsx('div', {
                    className: 'mt-1 text-xs text-gray-400',
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
