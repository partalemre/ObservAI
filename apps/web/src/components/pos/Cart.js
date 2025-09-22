import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { QuantityStepper } from './QuantityStepper'
import { DiscountInput } from './DiscountInput'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
import { usePOS } from '../../store/posStore'
import { t } from '../../lib/i18n'
export const Cart = ({ className, onCheckout }) => {
  const { lines, discount, updateQty, removeLine, setDiscount, clear, totals } =
    usePOS()
  const { subtotal, discountTotal, tax, total } = totals()
  if (lines.length === 0) {
    return _jsxs('div', {
      className: cn('space-y-4', className),
      children: [
        _jsx('h2', {
          className: 'text-lg font-semibold text-gray-900',
          children: 'Cart',
        }),
        _jsx('div', {
          className:
            'flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200',
          children: _jsx('p', {
            className: 'text-sm text-gray-500',
            children: 'Your cart is empty',
          }),
        }),
      ],
    })
  }
  return _jsxs('div', {
    className: cn('space-y-4', className),
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('h2', {
            className: 'text-lg font-semibold text-gray-900',
            children: 'Cart',
          }),
          _jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: clear,
            className: 'text-red-600 hover:text-red-700',
            children: t('pos.clear'),
          }),
        ],
      }),
      _jsx('div', {
        className: 'max-h-64 space-y-3 overflow-y-auto',
        children: lines.map((line) =>
          _jsxs(
            'div',
            {
              className:
                'flex items-center justify-between space-x-3 rounded-lg border border-gray-200 p-3',
              children: [
                _jsxs('div', {
                  className: 'min-w-0 flex-1',
                  children: [
                    _jsx('h4', {
                      className: 'truncate font-medium text-gray-900',
                      children: line.name,
                    }),
                    line.modifiers &&
                      line.modifiers.length > 0 &&
                      _jsx('div', {
                        className: 'mt-1 space-y-1',
                        children: line.modifiers.map((mod, idx) =>
                          _jsxs(
                            'p',
                            {
                              className: 'text-xs text-gray-600',
                              children: [
                                '+ ',
                                mod.name,
                                ' ',
                                mod.priceDelta > 0 &&
                                  `(+${formatCurrency(mod.priceDelta, 'en-US', 'TRY')})`,
                              ],
                            },
                            idx
                          )
                        ),
                      }),
                    _jsxs('p', {
                      className: 'mt-1 text-sm text-gray-600',
                      children: [
                        formatCurrency(line.unitPrice, 'en-US', 'TRY'),
                        ' each',
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    _jsx(QuantityStepper, {
                      value: line.qty,
                      onChange: (qty) => updateQty(line.id, qty),
                      min: 1,
                    }),
                    _jsx('button', {
                      type: 'button',
                      onClick: () => removeLine(line.id),
                      className: 'p-1 text-red-600 hover:text-red-700',
                      children: _jsx(Trash2, { className: 'h-4 w-4' }),
                    }),
                  ],
                }),
              ],
            },
            line.id
          )
        ),
      }),
      _jsx('div', {
        children: _jsx(DiscountInput, {
          discount: discount,
          onDiscountChange: setDiscount,
        }),
      }),
      _jsxs('div', {
        className: 'space-y-2 border-t pt-4',
        children: [
          _jsxs('div', {
            className: 'flex justify-between text-sm',
            children: [
              _jsx('span', {
                className: 'text-gray-600',
                children: t('pos.subtotal'),
              }),
              _jsx('span', {
                className: 'font-medium',
                children: formatCurrency(subtotal, 'en-US', 'TRY'),
              }),
            ],
          }),
          discountTotal > 0 &&
            _jsxs('div', {
              className: 'flex justify-between text-sm',
              children: [
                _jsx('span', {
                  className: 'text-gray-600',
                  children: t('pos.discount'),
                }),
                _jsxs('span', {
                  className: 'font-medium text-red-600',
                  children: [
                    '-',
                    formatCurrency(discountTotal, 'en-US', 'TRY'),
                  ],
                }),
              ],
            }),
          tax > 0 &&
            _jsxs('div', {
              className: 'flex justify-between text-sm',
              children: [
                _jsx('span', {
                  className: 'text-gray-600',
                  children: t('pos.tax'),
                }),
                _jsx('span', {
                  className: 'font-medium',
                  children: formatCurrency(tax, 'en-US', 'TRY'),
                }),
              ],
            }),
          _jsxs('div', {
            className: 'flex justify-between border-t pt-2',
            children: [
              _jsx('span', {
                className: 'font-semibold text-gray-900',
                children: t('pos.total'),
              }),
              _jsx('span', {
                className: 'font-display text-brand text-xl font-bold',
                children: formatCurrency(total, 'en-US', 'TRY'),
              }),
            ],
          }),
        ],
      }),
      _jsx(Button, {
        onClick: onCheckout,
        className: 'w-full',
        disabled: lines.length === 0,
        children: t('pos.checkout'),
      }),
    ],
  })
}
