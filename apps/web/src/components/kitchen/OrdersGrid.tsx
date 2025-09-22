import React from 'react'
import { cn } from '../../lib/utils'
import { OrderCard } from './OrderCard'
import { EmptyState } from '../ui/EmptyState'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
import { useKitchenStore } from '../../store/kitchenStore'
import { t } from '../../lib/i18n'

interface OrdersGridProps {
  tickets: OrderTicket[]
  onStatusChange: (id: string, status: OrderStatus) => void
  className?: string
}

export const OrdersGrid: React.FC<OrdersGridProps> = ({
  tickets,
  onStatusChange,
  className,
}) => {
  const { density } = useKitchenStore()

  // Group tickets by status
  const ticketsByStatus = {
    NEW: tickets.filter((t) => t.status === 'NEW'),
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS'),
    READY: tickets.filter((t) => t.status === 'READY'),
  }

  const columns = [
    {
      status: 'NEW' as const,
      title: t('kitchen.status.new'),
      tickets: ticketsByStatus.NEW,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      status: 'IN_PROGRESS' as const,
      title: t('kitchen.status.inprogress'),
      tickets: ticketsByStatus.IN_PROGRESS,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      status: 'READY' as const,
      title: t('kitchen.status.ready'),
      tickets: ticketsByStatus.READY,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ]

  if (tickets.length === 0) {
    return (
      <div className={cn('flex h-96 items-center justify-center', className)}>
        <EmptyState
          title={t('kitchen.empty')}
          description="New orders will appear here automatically"
        />
      </div>
    )
  }

  return (
    <div className={cn('flex-1 overflow-hidden', className)}>
      {/* Desktop: 3 columns */}
      <div className="hidden h-full gap-6 p-6 lg:flex">
        {columns.map((column) => (
          <div key={column.status} className="flex min-w-0 flex-1 flex-col">
            {/* Column Header */}
            <div
              className={cn(
                'flex items-center justify-between rounded-t-2xl border-b p-4',
                column.bgColor,
                column.borderColor
              )}
            >
              <h2 className="font-semibold text-gray-900">{column.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {column.tickets.length}
                </span>
                <div className="from-brand to-accent h-0.5 w-8 rounded-full bg-gradient-to-r" />
              </div>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                'flex-1 space-y-4 overflow-y-auto rounded-b-2xl border-r border-b border-l p-4',
                column.bgColor,
                column.borderColor
              )}
            >
              {column.tickets.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-gray-500">
                  <span className="text-sm">
                    No {column.title.toLowerCase()} orders
                  </span>
                </div>
              ) : (
                column.tickets.map((ticket) => (
                  <OrderCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={onStatusChange}
                    density={density}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Tabs + Single Column */}
      <div className="flex h-full flex-col lg:hidden">
        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {columns.map((column) => (
            <button
              key={column.status}
              className="flex-1 border-b-2 border-transparent px-4 py-3 text-center hover:border-gray-300 focus:outline-none"
            >
              <div className="font-medium text-gray-900">{column.title}</div>
              <div className="mt-1 text-xs text-gray-500">
                {column.tickets.length} orders
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Column Content - Show all tickets in a single scrollable list */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {tickets.map((ticket) => (
            <OrderCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={onStatusChange}
              density={density}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
