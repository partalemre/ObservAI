import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { useReceive } from '../../features/inventory/hooks'
import { t } from '../../lib/i18n'
export const ReceiveDialog = ({ open, onClose, items, storeId }) => {
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')
  const [lines, setLines] = useState([])
  const receiveMutation = useReceive(storeId)
  const addLine = () => {
    const newLine = {
      id: crypto.randomUUID(),
      itemId: '',
      qty: 1,
      unitCost: undefined,
    }
    setLines([...lines, newLine])
  }
  const updateLine = (id, updates) => {
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
  const removeLine = (id) => {
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
  return _jsx(Modal, {
    open: open,
    onClose: handleClose,
    className: 'max-w-4xl',
    children: _jsxs('div', {
      className: 'space-y-6',
      children: [
        _jsx('div', {
          children: _jsx('h2', {
            className: 'text-xl font-semibold text-gray-900',
            children: t('inventory.receive.title'),
          }),
        }),
        _jsxs('div', {
          className: 'grid grid-cols-1 gap-4 md:grid-cols-2',
          children: [
            _jsxs('div', {
              children: [
                _jsx(Label, {
                  htmlFor: 'supplier',
                  children: t('inventory.receive.supplier'),
                }),
                _jsx(Input, {
                  id: 'supplier',
                  value: supplier,
                  onChange: (e) => setSupplier(e.target.value),
                  placeholder: 'Enter supplier name',
                }),
              ],
            }),
            _jsxs('div', {
              children: [
                _jsx(Label, {
                  htmlFor: 'note',
                  children: t('inventory.receive.note'),
                }),
                _jsx(Input, {
                  id: 'note',
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  placeholder: 'Optional note',
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'space-y-4',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsx('h3', {
                  className: 'font-medium text-gray-900',
                  children: 'Items',
                }),
                _jsxs(Button, {
                  type: 'button',
                  onClick: addLine,
                  size: 'sm',
                  className: 'flex items-center gap-2',
                  children: [
                    _jsx(Plus, { className: 'h-4 w-4' }),
                    t('inventory.actions.addLine'),
                  ],
                }),
              ],
            }),
            lines.length === 0
              ? _jsx('div', {
                  className: 'py-8 text-center text-gray-500',
                  children: 'No items added yet. Click "Add line" to start.',
                })
              : _jsx('div', {
                  className: 'overflow-x-auto',
                  children: _jsxs('table', {
                    className: 'w-full',
                    children: [
                      _jsx('thead', {
                        children: _jsxs('tr', {
                          className: 'border-b border-gray-200',
                          children: [
                            _jsx('th', {
                              className:
                                'py-2 text-left font-medium text-gray-900',
                              children: 'Item',
                            }),
                            _jsx('th', {
                              className:
                                'py-2 text-left font-medium text-gray-900',
                              children: t('inventory.receive.qty'),
                            }),
                            _jsx('th', {
                              className:
                                'py-2 text-left font-medium text-gray-900',
                              children: t('inventory.receive.unitCost'),
                            }),
                            _jsx('th', {
                              className:
                                'py-2 text-left font-medium text-gray-900',
                              children: 'Total',
                            }),
                            _jsx('th', { className: 'w-10' }),
                          ],
                        }),
                      }),
                      _jsx('tbody', {
                        children: lines.map((line) =>
                          _jsxs(
                            'tr',
                            {
                              className: 'border-b border-gray-100',
                              children: [
                                _jsx('td', {
                                  className: 'py-3',
                                  children: _jsxs('select', {
                                    value: line.itemId,
                                    onChange: (e) =>
                                      updateLine(line.id, {
                                        itemId: e.target.value,
                                      }),
                                    className:
                                      'focus:border-brand focus:ring-brand w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none',
                                    children: [
                                      _jsx('option', {
                                        value: '',
                                        children: 'Select item...',
                                      }),
                                      availableItems.map((item) =>
                                        _jsxs(
                                          'option',
                                          {
                                            value: item.id,
                                            children: [
                                              item.name,
                                              ' ',
                                              item.sku ? `(${item.sku})` : '',
                                            ],
                                          },
                                          item.id
                                        )
                                      ),
                                      line.item &&
                                        _jsxs(
                                          'option',
                                          {
                                            value: line.item.id,
                                            children: [
                                              line.item.name,
                                              ' ',
                                              line.item.sku
                                                ? `(${line.item.sku})`
                                                : '',
                                            ],
                                          },
                                          line.item.id
                                        ),
                                    ],
                                  }),
                                }),
                                _jsx('td', {
                                  className: 'py-3',
                                  children: _jsx(Input, {
                                    type: 'number',
                                    value: line.qty,
                                    onChange: (e) =>
                                      updateLine(line.id, {
                                        qty: parseInt(e.target.value) || 0,
                                      }),
                                    min: '1',
                                    className: 'w-20',
                                  }),
                                }),
                                _jsx('td', {
                                  className: 'py-3',
                                  children: _jsx(Input, {
                                    type: 'number',
                                    value: line.unitCost || '',
                                    onChange: (e) =>
                                      updateLine(line.id, {
                                        unitCost:
                                          parseFloat(e.target.value) ||
                                          undefined,
                                      }),
                                    min: '0',
                                    step: '0.01',
                                    className: 'w-24',
                                    placeholder: '0.00',
                                  }),
                                }),
                                _jsx('td', {
                                  className: 'py-3 text-gray-900',
                                  children: line.unitCost
                                    ? (line.qty * line.unitCost).toFixed(2)
                                    : '-',
                                }),
                                _jsx('td', {
                                  className: 'py-3',
                                  children: _jsx(Button, {
                                    type: 'button',
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => removeLine(line.id),
                                    className:
                                      'text-red-600 hover:text-red-700',
                                    children: _jsx(Trash2, {
                                      className: 'h-4 w-4',
                                    }),
                                  }),
                                }),
                              ],
                            },
                            line.id
                          )
                        ),
                      }),
                    ],
                  }),
                }),
          ],
        }),
        _jsxs('div', {
          className: 'flex items-center justify-end gap-3 border-t pt-4',
          children: [
            _jsx(Button, {
              variant: 'outline',
              onClick: handleClose,
              children: t('inventory.actions.cancel'),
            }),
            _jsx(Button, {
              onClick: handleSubmit,
              disabled: receiveMutation.isPending || lines.length === 0,
              variant: 'accent',
              children: receiveMutation.isPending
                ? 'Saving...'
                : t('inventory.actions.save'),
            }),
          ],
        }),
      ],
    }),
  })
}
