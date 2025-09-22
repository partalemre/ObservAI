import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'
import { useAdjust } from '../../features/inventory/hooks'
import type { InventoryItem } from '../../features/inventory/types'
import { t } from '../../lib/i18n'

interface AdjustLine {
  id: string
  itemId: string
  item?: InventoryItem
  delta: number
}

interface AdjustDialogProps {
  open: boolean
  onClose: () => void
  items: InventoryItem[]
  storeId: string
}

export const AdjustDialog: React.FC<AdjustDialogProps> = ({
  open,
  onClose,
  items,
  storeId,
}) => {
  const [reason, setReason] = useState<'COUNT' | 'WASTE' | 'DAMAGE' | 'OTHER'>(
    'COUNT'
  )
  const [note, setNote] = useState('')
  const [lines, setLines] = useState<AdjustLine[]>([])

  const adjustMutation = useAdjust(storeId)

  const addLine = () => {
    const newLine: AdjustLine = {
      id: crypto.randomUUID(),
      itemId: '',
      delta: 0,
    }
    setLines([...lines, newLine])
  }

  const updateLine = (id: string, updates: Partial<AdjustLine>) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, ...updates }
          if (updates.itemId) {
            updated.item = items.find((item) => item.id === updates.itemId)
          }
          return updated
        }
        return line
      })
    )
  }

  const removeLine = (id: string) => {
    setLines(lines.filter((line) => line.id !== id))
  }

  const handleSubmit = async () => {
    const validLines = lines.filter((line) => line.itemId && line.delta !== 0)

    if (validLines.length === 0) {
      toast.error('Please add at least one adjustment')
      return
    }

    try {
      await adjustMutation.mutateAsync({
        storeId,
        reason,
        note: note || undefined,
        lines: validLines.map((line) => ({
          itemId: line.itemId,
          delta: line.delta,
        })),
      })

      toast.success(t('inventory.adjust.success'))
      handleClose()
    } catch (error) {
      toast.error('Failed to save adjustment')
    }
  }

  const handleClose = () => {
    setReason('COUNT')
    setNote('')
    setLines([])
    onClose()
  }

  const availableItems = items.filter(
    (item) => !lines.some((line) => line.itemId === item.id)
  )

  const reasons = [
    { value: 'COUNT', label: t('inventory.adjust.reasons.COUNT') },
    { value: 'WASTE', label: t('inventory.adjust.reasons.WASTE') },
    { value: 'DAMAGE', label: t('inventory.adjust.reasons.DAMAGE') },
    { value: 'OTHER', label: t('inventory.adjust.reasons.OTHER') },
  ] as const

  return (
    <Modal open={open} onClose={handleClose} className="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('inventory.adjust.title')}
          </h2>
        </div>

        {/* Reason and Note */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="reason">{t('inventory.adjust.reason')}</Label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="focus:border-brand focus:ring-brand w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="note">{t('inventory.receive.note')}</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Adjustments</h3>
            <Button
              type="button"
              onClick={addLine}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('inventory.actions.addLine')}
            </Button>
          </div>

          {lines.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No adjustments added yet. Click "Add line" to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left font-medium text-gray-900">
                      Item
                    </th>
                    <th className="py-2 text-left font-medium text-gray-900">
                      Current
                    </th>
                    <th className="py-2 text-left font-medium text-gray-900">
                      {t('inventory.adjust.delta')}
                    </th>
                    <th className="py-2 text-left font-medium text-gray-900">
                      New
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id} className="border-b border-gray-100">
                      <td className="py-3">
                        <select
                          value={line.itemId}
                          onChange={(e) =>
                            updateLine(line.id, { itemId: e.target.value })
                          }
                          className="focus:border-brand focus:ring-brand w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
                        >
                          <option value="">Select item...</option>
                          {availableItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} {item.sku ? `(${item.sku})` : ''}
                            </option>
                          ))}
                          {line.item && (
                            <option key={line.item.id} value={line.item.id}>
                              {line.item.name}{' '}
                              {line.item.sku ? `(${line.item.sku})` : ''}
                            </option>
                          )}
                        </select>
                      </td>
                      <td className="py-3 text-gray-600">
                        {line.item?.stockQty ?? '-'}
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={line.delta}
                          onChange={(e) =>
                            updateLine(line.id, {
                              delta: parseInt(e.target.value) || 0,
                            })
                          }
                          className={cn(
                            'w-20',
                            line.delta > 0 &&
                              'border-green-300 focus:border-green-500',
                            line.delta < 0 &&
                              'border-red-300 focus:border-red-500'
                          )}
                          placeholder="±0"
                        />
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'font-medium',
                            line.item &&
                              line.item.stockQty + line.delta < 0 &&
                              'text-red-600'
                          )}
                        >
                          {line.item ? line.item.stockQty + line.delta : '-'}
                        </span>
                      </td>
                      <td className="py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(line.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            {t('inventory.actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={adjustMutation.isPending || lines.length === 0}
          >
            {adjustMutation.isPending
              ? 'Saving...'
              : t('inventory.actions.save')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
