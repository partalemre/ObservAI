import React, { useState } from 'react'
import { Modal, Button, Input, Label, Title } from '../ui'
import { useCashIn, useCashOut } from '../../features/payments/hooks'
import { t } from '../../lib/i18n'
import toast from 'react-hot-toast'

interface CashInOutDialogProps {
  open: boolean
  onClose: () => void
  storeId: string
}

export const CashInOutDialog: React.FC<CashInOutDialogProps> = ({
  open,
  onClose,
  storeId,
}) => {
  const [mode, setMode] = useState<'in' | 'out'>('in')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const cashInMutation = useCashIn(storeId)
  const cashOutMutation = useCashOut(storeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }

    const mutation = mode === 'in' ? cashInMutation : cashOutMutation
    const successMessage =
      mode === 'in'
        ? t('payments.success.cashedIn')
        : t('payments.success.cashedOut')

    mutation.mutate(
      { storeId, amount: amountValue, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(successMessage)
          setAmount('')
          setReason('')
          onClose()
        },
        onError: () => {
          toast.error('Failed to process cash transaction')
        },
      }
    )
  }

  const isPending = cashInMutation.isPending || cashOutMutation.isPending

  return (
    <Modal open={open} onClose={onClose}>
      <Title level={2} className="mb-4">
        {mode === 'in'
          ? t('payments.inout.titleIn')
          : t('payments.inout.titleOut')}
      </Title>

      <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'in'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setMode('in')}
        >
          {t('payments.actions.cashIn')}
        </button>
        <button
          type="button"
          className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'out'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setMode('out')}
        >
          {t('payments.actions.cashOut')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">{t('payments.inout.amount')}</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="reason">{t('payments.inout.reason')}</Label>
          <Input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {t('payments.actions.cancel')}
          </Button>
          <Button type="submit" loading={isPending}>
            {t('payments.actions.confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
