import React from 'react'
import type { InventoryItem } from '../../features/inventory/types'
interface AdjustDialogProps {
  open: boolean
  onClose: () => void
  items: InventoryItem[]
  storeId: string
}
export declare const AdjustDialog: React.FC<AdjustDialogProps>
export {}
