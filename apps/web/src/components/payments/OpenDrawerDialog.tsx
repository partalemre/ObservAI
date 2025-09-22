import React, { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useOpenDrawer } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'

interface OpenDrawerDialogProps {
  open: boolean
  onClose: () => void
  storeId: string
}

export const OpenDrawerDialog: React.FC<OpenDrawerDialogProps> = ({
  open,
  onClose,
  storeId,
}) => {
  const [floatAmount, setFloatAmount] = useState('')
  const openDrawerMutation = useOpenDrawer(storeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(floatAmount)
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid amount')
      return
    }

    openDrawerMutation.mutate(
      { storeId, floatAmount: amount },
      {
        onSuccess: () => {
          toast.success(t('payments.success.opened'))
          setFloatAmount('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to open drawer')
        },
      }
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Title level={2} className="mb-4">
        {t('payments.open.title')}
      </Title>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="float-amount">{t('payments.open.float')}</Label>
          <Input
            id="float-amount"
            type="number"
            step="0.01"
            min="0"
            value={floatAmount}
            onChange={(e) => setFloatAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={openDrawerMutation.isPending}
          >
            {t('payments.actions.cancel')}
          </Button>
          <Button type="submit" loading={openDrawerMutation.isPending}>
            {t('payments.actions.open')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
