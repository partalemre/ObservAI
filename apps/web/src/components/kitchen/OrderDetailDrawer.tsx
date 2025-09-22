import React from 'react'
import { X, Clock, MapPin, StickyNote, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
import { t } from '../../lib/i18n'

interface OrderDetailDrawerProps {
  ticket: OrderTicket | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: OrderStatus) => void
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  ticket,
  open,
  onClose,
  onStatusChange,
}) => {
  if (!ticket) return null

  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60)
  )

  const getChannelBadgeColor = () => {
    switch (ticket.channel) {
      case 'DINE_IN':
        return 'bg-blue-100 text-blue-800'
      case 'TAKEAWAY':
        return 'bg-green-100 text-green-800'
      case 'DELIVERY':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = () => {
    switch (ticket.status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800'
      case 'READY':
        return 'bg-green-100 text-green-800'
      case 'SERVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNextActions = () => {
    const actions = []
    switch (ticket.status) {
      case 'NEW':
        actions.push({
          label: t('kitchen.actions.start'),
          nextStatus: 'IN_PROGRESS' as OrderStatus,
          variant: 'default' as const,
        })
        break
      case 'IN_PROGRESS':
        actions.push({
          label: t('kitchen.actions.ready'),
          nextStatus: 'READY' as OrderStatus,
          variant: 'default' as const,
        })
        break
      case 'READY':
        actions.push({
          label: t('kitchen.actions.serve'),
          nextStatus: 'SERVED' as OrderStatus,
          variant: 'accent' as const,
        })
        break
    }
    return actions
  }

  // Group lines by station
  const linesByStation = ticket.lines.reduce(
    (acc, line) => {
      const station = line.station || 'OTHER'
      if (!acc[station]) acc[station] = []
      acc[station].push(line)
      return acc
    },
    {} as Record<string, typeof ticket.lines>
  )

  const nextActions = getNextActions()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-lg transform bg-white shadow-xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {ticket.number}
              </h2>
              <p className="mt-1 text-sm text-gray-600">Order details</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Order Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor()}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getChannelBadgeColor()}>
                    {ticket.channel.replace('_', ' ')}
                  </Badge>
                  {ticket.priority && (
                    <Badge className="bg-accent text-white">
                      {t('kitchen.priority')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {elapsedMinutes}m {t('kitchen.elapsed').toLowerCase()}
                </div>
              </div>

              {ticket.tableNo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {t('kitchen.table')} {ticket.tableNo}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                Created{' '}
                {formatDistanceToNow(new Date(ticket.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>

            {/* Order Items by Station */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              {Object.entries(linesByStation).map(([station, lines]) => (
                <div key={station} className="space-y-3">
                  {station !== 'OTHER' && (
                    <h4 className="border-b border-gray-200 pb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                      {station} Station
                    </h4>
                  )}
                  {lines.map((line, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="font-medium text-gray-900">
                          {line.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Qty: {line.qty}
                        </div>
                      </div>
                      {line.modifiers && line.modifiers.length > 0 && (
                        <div className="space-y-1">
                          {line.modifiers.map((mod, i) => (
                            <div key={i} className="text-sm text-gray-600">
                              <span className="font-medium">{mod.name}:</span>{' '}
                              {mod.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Note */}
            {ticket.note && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Special Instructions
                </h3>
                <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <div className="flex items-start gap-2">
                    <StickyNote className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    <p className="text-yellow-800">{ticket.note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {nextActions.length > 0 && (
            <div className="space-y-3 border-t border-gray-200 p-6">
              {nextActions.map((action) => (
                <Button
                  key={action.nextStatus}
                  onClick={() => {
                    onStatusChange(ticket.id, action.nextStatus)
                    onClose()
                  }}
                  variant={action.variant}
                  className="w-full"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
