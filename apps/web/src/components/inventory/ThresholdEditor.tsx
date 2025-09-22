import React, { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
import type { InventoryItem } from '../../features/inventory/types'

interface ThresholdEditorProps {
  item: InventoryItem
  onUpdate?: (
    id: string,
    updates: { minQty?: number; reorderQty?: number }
  ) => void
  disabled?: boolean
  className?: string
}

export const ThresholdEditor: React.FC<ThresholdEditorProps> = ({
  item,
  onUpdate,
  disabled = false,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [minQty, setMinQty] = useState(item.minQty)
  const [reorderQty, setReorderQty] = useState(item.reorderQty || 0)

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(item.id, { minQty, reorderQty })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setMinQty(item.minQty)
    setReorderQty(item.reorderQty || 0)
    setIsEditing(false)
  }

  if (disabled || item.stockQty <= 0) {
    return (
      <div className={cn('text-gray-400', className)}>
        <div className="text-sm">Min: {item.minQty}</div>
        <div className="text-sm">Reorder: {item.reorderQty || '-'}</div>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div className={cn('group', className)}>
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm text-gray-600">Min: {item.minQty}</div>
            <div className="text-sm text-gray-600">
              Reorder: {item.reorderQty || '-'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-1">
        <span className="w-8 text-xs text-gray-500">Min:</span>
        <Input
          type="number"
          value={minQty}
          onChange={(e) => setMinQty(parseInt(e.target.value) || 0)}
          min="0"
          className="h-7 w-16 text-xs"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="w-8 text-xs text-gray-500">Rec:</span>
        <Input
          type="number"
          value={reorderQty}
          onChange={(e) => setReorderQty(parseInt(e.target.value) || 0)}
          min="0"
          className="h-7 w-16 text-xs"
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
