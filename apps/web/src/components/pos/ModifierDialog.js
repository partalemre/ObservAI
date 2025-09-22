import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
export const ModifierDialog = ({
  open,
  onClose,
  item,
  modifierGroups,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState([])
  // Filter relevant modifier groups
  const relevantGroups = modifierGroups.filter((group) =>
    item.modifierGroupIds?.includes(group.id)
  )
  // Validation
  const isValid = useMemo(() => {
    return relevantGroups.every((group) => {
      const groupSelections = selectedModifiers.filter(
        (m) => m.groupId === group.id
      )
      return (
        groupSelections.length >= group.min &&
        groupSelections.length <= group.max
      )
    })
  }, [relevantGroups, selectedModifiers])
  // Calculate total price
  const totalPrice = useMemo(() => {
    const basePrice = item.price
    const modifierPrice = selectedModifiers.reduce(
      (sum, mod) => sum + mod.priceDelta,
      0
    )
    return (basePrice + modifierPrice) * quantity
  }, [item.price, selectedModifiers, quantity])
  const handleModifierToggle = (group, optionId) => {
    const option = group.options.find((opt) => opt.id === optionId)
    if (!option) return
    setSelectedModifiers((prev) => {
      const existing = prev.filter((m) => m.groupId === group.id)
      const isSelected = existing.some((m) => m.optionId === optionId)
      if (isSelected) {
        // Remove selection
        return prev.filter(
          (m) => !(m.groupId === group.id && m.optionId === optionId)
        )
      } else {
        // Add selection
        const newModifier = {
          groupId: group.id,
          optionId: option.id,
          name: option.name,
          priceDelta: option.priceDelta,
        }
        if (group.max === 1) {
          // Single selection: replace existing
          return [...prev.filter((m) => m.groupId !== group.id), newModifier]
        } else {
          // Multiple selection: add if under max
          if (existing.length < group.max) {
            return [...prev, newModifier]
          }
          return prev
        }
      }
    })
  }
  const handleAddToCart = () => {
    if (isValid) {
      onAddToCart(item, quantity, selectedModifiers)
      onClose()
      // Reset state
      setQuantity(1)
      setSelectedModifiers([])
    }
  }
  const handleClose = () => {
    onClose()
    // Reset state
    setQuantity(1)
    setSelectedModifiers([])
  }
  return _jsx(Modal, {
    open: open,
    onClose: handleClose,
    className: 'max-w-lg',
    children: _jsxs('div', {
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          children: [
            _jsx('h2', {
              className: 'text-xl font-semibold text-gray-900',
              children: item.name,
            }),
            _jsx('p', {
              className: 'mt-1 text-sm text-gray-600',
              children: 'Choose options',
            }),
          ],
        }),
        _jsx('div', {
          className: 'space-y-6',
          children: relevantGroups.map((group) => {
            const groupSelections = selectedModifiers.filter(
              (m) => m.groupId === group.id
            )
            const isRequired = group.min > 0
            return _jsxs(
              'div',
              {
                className: 'space-y-3',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center justify-between',
                    children: [
                      _jsx('h3', {
                        className: 'font-medium text-gray-900',
                        children: group.name,
                      }),
                      _jsxs('div', {
                        className: 'flex items-center space-x-2',
                        children: [
                          isRequired &&
                            _jsx(Badge, {
                              variant: 'destructive',
                              className: 'text-xs',
                              children: 'Required',
                            }),
                          group.max > 1 &&
                            _jsxs(Badge, {
                              variant: 'secondary',
                              className: 'text-xs',
                              children: [
                                groupSelections.length,
                                '/',
                                group.max,
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                  _jsx('div', {
                    className: 'space-y-2',
                    children: group.options.map((option) => {
                      const isSelected = groupSelections.some(
                        (m) => m.optionId === option.id
                      )
                      const canSelect =
                        !isSelected && groupSelections.length < group.max
                      return _jsxs(
                        'button',
                        {
                          type: 'button',
                          onClick: () => handleModifierToggle(group, option.id),
                          disabled: !isSelected && !canSelect,
                          className: cn(
                            'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                            isSelected
                              ? 'border-brand bg-brand/5 text-brand'
                              : canSelect
                                ? 'border-gray-200 text-gray-900 hover:border-gray-300'
                                : 'cursor-not-allowed border-gray-200 text-gray-400'
                          ),
                          children: [
                            _jsx('span', {
                              className: 'font-medium',
                              children: option.name,
                            }),
                            option.priceDelta !== 0 &&
                              _jsxs('span', {
                                className: 'text-sm',
                                children: [
                                  option.priceDelta > 0 ? '+' : '',
                                  formatCurrency(
                                    option.priceDelta,
                                    'en-US',
                                    'TRY'
                                  ),
                                ],
                              }),
                          ],
                        },
                        option.id
                      )
                    }),
                  }),
                ],
              },
              group.id
            )
          }),
        }),
        _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            _jsx('span', {
              className: 'font-medium text-gray-900',
              children: 'Quantity',
            }),
            _jsxs('div', {
              className: 'flex items-center space-x-3',
              children: [
                _jsx('button', {
                  type: 'button',
                  onClick: () => setQuantity(Math.max(1, quantity - 1)),
                  className:
                    'flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200',
                  children: '-',
                }),
                _jsx('span', {
                  className: 'w-8 text-center font-medium',
                  children: quantity,
                }),
                _jsx('button', {
                  type: 'button',
                  onClick: () => setQuantity(quantity + 1),
                  className:
                    'flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200',
                  children: '+',
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'flex items-center justify-between border-t pt-4',
          children: [
            _jsx(Button, {
              variant: 'outline',
              onClick: handleClose,
              children: 'Cancel',
            }),
            _jsxs(Button, {
              onClick: handleAddToCart,
              disabled: !isValid,
              className: 'min-w-[120px]',
              children: ['Add ', formatCurrency(totalPrice, 'en-US', 'TRY')],
            }),
          ],
        }),
      ],
    }),
  })
}
