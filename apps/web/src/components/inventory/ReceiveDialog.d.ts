import React from 'react'
import type { InventoryItem } from '../../features/inventory/types'
interface ReceiveDialogProps {
  open: boolean
  onClose: () => void
  items: InventoryItem[]
  storeId: string
}
export declare const ReceiveDialog: React.FC<ReceiveDialogProps>
export {}
