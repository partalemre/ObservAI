import React from 'react'
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
export declare const ModifierDialog: React.FC<ModifierDialogProps>
export {}
