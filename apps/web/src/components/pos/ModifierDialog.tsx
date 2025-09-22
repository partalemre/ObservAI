import React, { useState, useMemo } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/format'
import type {
  Item,
  ModifierGroup,
  ChosenModifier,
} from '../../features/pos/types'

interface ModifierDialogProps {
  open: boolean
  onClose: () => void
  item: Item
  modifierGroups: ModifierGroup[]
  onAddToCart: (item: Item, qty: number, modifiers: ChosenModifier[]) => void
}

export const ModifierDialog: React.FC<ModifierDialogProps> = ({
  open,
  onClose,
  item,
  modifierGroups,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<ChosenModifier[]>(
    []
  )

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

  const handleModifierToggle = (group: ModifierGroup, optionId: string) => {
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
        const newModifier: ChosenModifier = {
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

  return (
    <Modal open={open} onClose={handleClose} className="max-w-lg">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
          <p className="mt-1 text-sm text-gray-600">Choose options</p>
        </div>

        {/* Modifier Groups */}
        <div className="space-y-6">
          {relevantGroups.map((group) => {
            const groupSelections = selectedModifiers.filter(
              (m) => m.groupId === group.id
            )
            const isRequired = group.min > 0

            return (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <div className="flex items-center space-x-2">
                    {isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {group.max > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        {groupSelections.length}/{group.max}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = groupSelections.some(
                      (m) => m.optionId === option.id
                    )
                    const canSelect =
                      !isSelected && groupSelections.length < group.max

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleModifierToggle(group, option.id)}
                        disabled={!isSelected && !canSelect}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                          isSelected
                            ? 'border-brand bg-brand/5 text-brand'
                            : canSelect
                              ? 'border-gray-200 text-gray-900 hover:border-gray-300'
                              : 'cursor-not-allowed border-gray-200 text-gray-400'
                        )}
                      >
                        <span className="font-medium">{option.name}</span>
                        {option.priceDelta !== 0 && (
                          <span className="text-sm">
                            {option.priceDelta > 0 ? '+' : ''}
                            {formatCurrency(option.priceDelta, 'en-US', 'TRY')}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Quantity</span>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!isValid}
            className="min-w-[120px]"
          >
            Add {formatCurrency(totalPrice, 'en-US', 'TRY')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
