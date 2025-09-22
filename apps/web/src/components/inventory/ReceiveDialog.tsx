import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'
import { useReceive } from '../../features/inventory/hooks'
import type { InventoryItem } from '../../features/inventory/types'
import { t } from '../../lib/i18n'

interface ReceiveLine {
  id: string
  itemId: string
  item?: InventoryItem
  qty: number
  unitCost?: number
}

interface ReceiveDialogProps {
  open: boolean
  onClose: () => void
  items: InventoryItem[]
  storeId: string
}

export const ReceiveDialog: React.FC<ReceiveDialogProps> = ({
  open,
  onClose,
  items,
  storeId,
}) => {
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')
  const [lines, setLines] = useState<ReceiveLine[]>([])

  const receiveMutation = useReceive(storeId)

  const addLine = () => {
    const newLine: ReceiveLine = {
      id: crypto.randomUUID(),
      itemId: '',
      qty: 1,
      unitCost: undefined,
    }
    setLines([...lines, newLine])
  }

  const updateLine = (id: string, updates: Partial<ReceiveLine>) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, ...updates }
          if (updates.itemId) {
            updated.item = items.find((item) => item.id === updates.itemId)
            updated.unitCost = updated.item?.costPrice || 0
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
    const validLines = lines.filter((line) => line.itemId && line.qty > 0)

    if (validLines.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    try {
      await receiveMutation.mutateAsync({
        storeId,
        supplier: supplier || undefined,
        note: note || undefined,
        lines: validLines.map((line) => ({
          itemId: line.itemId,
          qty: line.qty,
          unitCost: line.unitCost,
        })),
      })

      toast.success(t('inventory.receive.success'))
      handleClose()
    } catch (error) {
      toast.error('Failed to save receipt')
    }
  }

  const handleClose = () => {
    setSupplier('')
    setNote('')
    setLines([])
    onClose()
  }

  const availableItems = items.filter(
    (item) => !lines.some((line) => line.itemId === item.id)
  )

  return (
    <Modal open={open} onClose={handleClose} className="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('inventory.receive.title')}
          </h2>
        </div>

        {/* Supplier and Note */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="supplier">{t('inventory.receive.supplier')}</Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Enter supplier name"
            />
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
            <h3 className="font-medium text-gray-900">Items</h3>
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
              No items added yet. Click "Add line" to start.
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
                      {t('inventory.receive.qty')}
                    </th>
                    <th className="py-2 text-left font-medium text-gray-900">
                      {t('inventory.receive.unitCost')}
                    </th>
                    <th className="py-2 text-left font-medium text-gray-900">
                      Total
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
                      <td className="py-3">
                        <Input
                          type="number"
                          value={line.qty}
                          onChange={(e) =>
                            updateLine(line.id, {
                              qty: parseInt(e.target.value) || 0,
                            })
                          }
                          min="1"
                          className="w-20"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={line.unitCost || ''}
                          onChange={(e) =>
                            updateLine(line.id, {
                              unitCost: parseFloat(e.target.value) || undefined,
                            })
                          }
                          min="0"
                          step="0.01"
                          className="w-24"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-3 text-gray-900">
                        {line.unitCost
                          ? (line.qty * line.unitCost).toFixed(2)
                          : '-'}
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
            disabled={receiveMutation.isPending || lines.length === 0}
            variant="accent"
          >
            {receiveMutation.isPending
              ? 'Saving...'
              : t('inventory.actions.save')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
