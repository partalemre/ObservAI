import React, { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useCloseDrawer, useDrawer } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'

interface EndShiftDialogProps {
  open: boolean
  onClose: () => void
  storeId: string
}

export const EndShiftDialog: React.FC<EndShiftDialogProps> = ({
  open,
  onClose,
  storeId,
}) => {
  const [countedTotal, setCountedTotal] = useState('')
  const { data: drawer } = useDrawer(storeId)
  const closeDrawerMutation = useCloseDrawer(storeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const total = parseFloat(countedTotal)
    if (isNaN(total) || total < 0) {
      toast.error('Please enter a valid counted total')
      return
    }

    closeDrawerMutation.mutate(
      {
        storeId,
        countedBy: 'clerk', // In a real app, this would be the current user
        countedTotal: total,
      },
      {
        onSuccess: () => {
          toast.success(t('payments.success.closed'))
          setCountedTotal('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to close drawer')
        },
      }
    )
  }

  const systemBalance = drawer?.balance || 0
  const countedValue = parseFloat(countedTotal) || 0
  const difference = countedValue - systemBalance

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <Title level={2} className="mb-4">
        {t('payments.close.title')}
      </Title>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">System Balance:</span>
          <span className="font-medium">${systemBalance.toFixed(2)}</span>
        </div>
        {countedTotal && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Counted Total:</span>
            <span className="font-medium">${countedValue.toFixed(2)}</span>
          </div>
        )}
        {countedTotal && difference !== 0 && (
          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <span className="text-sm text-gray-600">Difference:</span>
            <span
              className={`font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {difference > 0 ? '+' : ''}${difference.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="counted-total">{t('payments.close.counted')}</Label>
          <Input
            id="counted-total"
            type="number"
            step="0.01"
            min="0"
            value={countedTotal}
            onChange={(e) => setCountedTotal(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={closeDrawerMutation.isPending}
          >
            {t('payments.actions.cancel')}
          </Button>
          <Button type="submit" loading={closeDrawerMutation.isPending}>
            {t('payments.close.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
