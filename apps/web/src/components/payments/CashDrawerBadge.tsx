import React, { useState } from 'react'
import { DollarSign, Lock, Unlock } from 'lucide-react'
import { Badge, Button } from '../ui'
import { useDrawer } from '../../features/payments/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
import { OpenDrawerDialog } from './OpenDrawerDialog'
import { CashInOutDialog } from './CashInOutDialog'
import { EndShiftDialog } from './EndShiftDialog'

export const CashDrawerBadge: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const { data: drawer, isLoading } = useDrawer(selectedStoreId || '')

  const [openDialog, setOpenDialog] = useState<
    'open' | 'cashinout' | 'endshift' | null
  >(null)

  if (isLoading || !selectedStoreId) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const isOpen = drawer?.status === 'OPEN'

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge
          variant={isOpen ? 'success' : 'default'}
          className="flex items-center gap-1"
        >
          {isOpen ? (
            <Unlock className="h-3 w-3" />
          ) : (
            <Lock className="h-3 w-3" />
          )}
          {isOpen ? t('payments.badge.open') : t('payments.badge.closed')}
        </Badge>

        {isOpen && drawer?.balance !== undefined && (
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {drawer.balance.toFixed(2)}
          </Badge>
        )}

        {!isOpen ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpenDialog('open')}
          >
            {t('payments.actions.open')}
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpenDialog('cashinout')}
            >
              {t('payments.actions.cashIn')}/{t('payments.actions.cashOut')}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setOpenDialog('endshift')}
            >
              {t('payments.actions.endShift')}
            </Button>
          </div>
        )}
      </div>

      <OpenDrawerDialog
        open={openDialog === 'open'}
        onClose={() => setOpenDialog(null)}
        storeId={selectedStoreId}
      />

      <CashInOutDialog
        open={openDialog === 'cashinout'}
        onClose={() => setOpenDialog(null)}
        storeId={selectedStoreId}
      />

      <EndShiftDialog
        open={openDialog === 'endshift'}
        onClose={() => setOpenDialog(null)}
        storeId={selectedStoreId}
      />
    </>
  )
}
