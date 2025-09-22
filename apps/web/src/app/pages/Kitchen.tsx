import React, { useState, useMemo } from 'react'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui'
import { KitchenFilters } from '../../components/kitchen/KitchenFilters'
import { OrdersGrid } from '../../components/kitchen/OrdersGrid'
import { OrderDetailDrawer } from '../../components/kitchen/OrderDetailDrawer'
import { Sound } from '../../components/kitchen/Sound'
import { useOrderFeed, useUpdateOrderStatus } from '../../features/orders/hooks'
import { useKitchenStore } from '../../store/kitchenStore'
import { useOrgStore } from '../../store/orgStore'
import type { OrderTicket, OrderStatus } from '../../features/orders/types'
import { t } from '../../lib/i18n'

export const Kitchen: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const { filter, sound } = useKitchenStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<OrderTicket | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Data fetching
  const { data: tickets = [], isLoading } = useOrderFeed(
    selectedStoreId || undefined
  )
  const updateStatusMutation = useUpdateOrderStatus(
    selectedStoreId || undefined
  )

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets

    // Filter by channel
    if (filter.channel && filter.channel !== 'ALL') {
      filtered = filtered.filter((ticket) => ticket.channel === filter.channel)
    }

    // Filter by status
    if (filter.status && filter.status !== 'ALL') {
      filtered = filtered.filter((ticket) => ticket.status === filter.status)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.number.toLowerCase().includes(query) ||
          ticket.tableNo?.toLowerCase().includes(query) ||
          ticket.lines.some((line) => line.name.toLowerCase().includes(query))
      )
    }

    // Sort by created time (oldest first)
    return filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [tickets, filter, searchQuery])

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ id, status })
  }

  const handleTicketClick = (ticket: OrderTicket) => {
    setSelectedTicket(ticket)
    setDrawerOpen(true)
  }

  if (!selectedStoreId) {
    return (
      <div className="p-6">
        <EmptyState
          title="No Store Selected"
          description="Please select a store to view the kitchen display"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="p-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {t('kitchen.title')}
          </h1>
          <p className="text-sm text-gray-600">
            Oldest first. Auto-refresh every 3s.
          </p>
        </div>

        {/* Filters */}
        <KitchenFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 p-6">
          <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <OrdersGrid
          tickets={filteredTickets}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedTicket(null)
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Sound notifications */}
      <Sound
        enabled={sound}
        newTicketsCount={tickets.filter((t) => t.status === 'NEW').length}
      />
    </div>
  )
}
