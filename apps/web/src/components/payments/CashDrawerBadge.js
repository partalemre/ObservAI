import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'react/jsx-runtime'
import { useState } from 'react'
import { DollarSign, Lock, Unlock } from 'lucide-react'
import { Badge, Button } from '../ui'
import { useDrawer } from '../../features/payments/hooks'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
import { OpenDrawerDialog } from './OpenDrawerDialog'
import { CashInOutDialog } from './CashInOutDialog'
import { EndShiftDialog } from './EndShiftDialog'
export const CashDrawerBadge = () => {
  const { selectedStoreId } = useOrgStore()
  const { data: drawer, isLoading } = useDrawer(selectedStoreId || '')
  const [openDialog, setOpenDialog] = useState(null)
  if (isLoading || !selectedStoreId) {
    return _jsx('div', {
      className: 'flex items-center gap-2',
      children: _jsx('div', {
        className: 'h-6 w-16 animate-pulse rounded bg-gray-200',
      }),
    })
  }
  const isOpen = drawer?.status === 'OPEN'
  return _jsxs(_Fragment, {
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-2',
        children: [
          _jsxs(Badge, {
            variant: isOpen ? 'success' : 'default',
            className: 'flex items-center gap-1',
            children: [
              isOpen
                ? _jsx(Unlock, { className: 'h-3 w-3' })
                : _jsx(Lock, { className: 'h-3 w-3' }),
              isOpen ? t('payments.badge.open') : t('payments.badge.closed'),
            ],
          }),
          isOpen &&
            drawer?.balance !== undefined &&
            _jsxs(Badge, {
              variant: 'outline',
              className: 'flex items-center gap-1',
              children: [
                _jsx(DollarSign, { className: 'h-3 w-3' }),
                drawer.balance.toFixed(2),
              ],
            }),
          !isOpen
            ? _jsx(Button, {
                size: 'sm',
                variant: 'secondary',
                onClick: () => setOpenDialog('open'),
                children: t('payments.actions.open'),
              })
            : _jsxs('div', {
                className: 'flex gap-1',
                children: [
                  _jsxs(Button, {
                    size: 'sm',
                    variant: 'ghost',
                    onClick: () => setOpenDialog('cashinout'),
                    children: [
                      t('payments.actions.cashIn'),
                      '/',
                      t('payments.actions.cashOut'),
                    ],
                  }),
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'secondary',
                    onClick: () => setOpenDialog('endshift'),
                    children: t('payments.actions.endShift'),
                  }),
                ],
              }),
        ],
      }),
      _jsx(OpenDrawerDialog, {
        open: openDialog === 'open',
        onClose: () => setOpenDialog(null),
        storeId: selectedStoreId,
      }),
      _jsx(CashInOutDialog, {
        open: openDialog === 'cashinout',
        onClose: () => setOpenDialog(null),
        storeId: selectedStoreId,
      }),
      _jsx(EndShiftDialog, {
        open: openDialog === 'endshift',
        onClose: () => setOpenDialog(null),
        storeId: selectedStoreId,
      }),
    ],
  })
}
