import React from 'react'
import type { InventoryItem } from '../../features/inventory/types'
interface ThresholdEditorProps {
  item: InventoryItem
  onUpdate?: (
    id: string,
    updates: {
      minQty?: number
      reorderQty?: number
    }
  ) => void
  disabled?: boolean
  className?: string
}
export declare const ThresholdEditor: React.FC<ThresholdEditorProps>
export {}
