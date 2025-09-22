import React from 'react'
import { Clock, AlertCircle, MapPin, StickyNote } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
import { t } from '../../lib/i18n'

interface OrderCardProps {
  ticket: OrderTicket
  onStatusChange: (id: string, status: OrderStatus) => void
  density?: 'comfortable' | 'compact'
  className?: string
}

export const OrderCard: React.FC<OrderCardProps> = ({
  ticket,
  onStatusChange,
  density = 'comfortable',
  className,
}) => {
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60)
  )

  // SLA coloring
  const getElapsedStyle = () => {
    if (elapsedMinutes < 5) return 'bg-gray-100 text-gray-700'
    if (elapsedMinutes < 10) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

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

  const getNextAction = () => {
    switch (ticket.status) {
      case 'NEW':
        return {
          label: t('kitchen.actions.start'),
          nextStatus: 'IN_PROGRESS' as OrderStatus,
          variant: 'default' as const,
        }
      case 'IN_PROGRESS':
        return {
          label: t('kitchen.actions.ready'),
          nextStatus: 'READY' as OrderStatus,
          variant: 'default' as const,
        }
      case 'READY':
        return {
          label: t('kitchen.actions.serve'),
          nextStatus: 'SERVED' as OrderStatus,
          variant: 'accent' as const,
        }
      default:
        return null
    }
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

  const nextAction = getNextAction()
  const isCompact = density === 'compact'

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className={cn('p-4', isCompact && 'p-3')}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'font-bold text-gray-900',
                isCompact ? 'text-lg' : 'text-xl'
              )}
            >
              {ticket.number}
            </h3>
            {ticket.priority && (
              <div
                className="bg-accent h-2 w-2 rounded-full"
                title={t('kitchen.priority')}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Elapsed time */}
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                getElapsedStyle()
              )}
            >
              <Clock className="h-3 w-3" />
              {elapsedMinutes}m
            </div>

            {/* Channel badge */}
            <Badge className={cn('text-xs', getChannelBadgeColor())}>
              {ticket.channel.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Table info */}
        {ticket.tableNo && (
          <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {t('kitchen.table')} {ticket.tableNo}
          </div>
        )}

        {/* Order lines by station */}
        <div className="space-y-3">
          {Object.entries(linesByStation).map(([station, lines]) => (
            <div key={station} className="space-y-1">
              {station !== 'OTHER' && (
                <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {station}
                </div>
              )}
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-start justify-between',
                    isCompact ? 'text-sm' : 'text-base'
                  )}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {line.qty}× {line.name}
                    </div>
                    {line.modifiers && line.modifiers.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        {line.modifiers.map((mod, i) => (
                          <div key={i}>
                            + {mod.name}: {mod.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Note */}
        {ticket.note && (
          <div className="mt-3 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-2">
            <div className="flex items-start gap-2">
              <StickyNote className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
              <div className="text-sm text-yellow-800">
                <div className="font-medium">{t('kitchen.note')}:</div>
                <div>{ticket.note}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {nextAction && (
        <div className="px-4 pb-4">
          <Button
            onClick={() => onStatusChange(ticket.id, nextAction.nextStatus)}
            variant={nextAction.variant}
            className="w-full"
            size={isCompact ? 'sm' : 'default'}
          >
            {nextAction.label}
          </Button>
        </div>
      )}
    </div>
  )
}
