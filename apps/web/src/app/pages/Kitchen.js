import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo } from 'react'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui'
import { KitchenFilters } from '../../components/kitchen/KitchenFilters'
import { OrdersGrid } from '../../components/kitchen/OrdersGrid'
import { OrderDetailDrawer } from '../../components/kitchen/OrderDetailDrawer'
import { Sound } from '../../components/kitchen/Sound'
import { useOrderFeed, useUpdateOrderStatus } from '../../features/orders/hooks'
import { useKitchenStore } from '../../store/kitchenStore'
import { useOrgStore } from '../../store/orgStore'
import { t } from '../../lib/i18n'
export const Kitchen = () => {
  const { selectedStoreId } = useOrgStore()
  const { filter, sound } = useKitchenStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
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
  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status })
  }
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
    setDrawerOpen(true)
  }
  if (!selectedStoreId) {
    return _jsx('div', {
      className: 'p-6',
      children: _jsx(EmptyState, {
        title: 'No Store Selected',
        description: 'Please select a store to view the kitchen display',
      }),
    })
  }
  return _jsxs('div', {
    className: 'flex h-full flex-col',
    children: [
      _jsxs('div', {
        className: 'border-b border-gray-200 bg-white',
        children: [
          _jsxs('div', {
            className: 'p-6',
            children: [
              _jsx('h1', {
                className: 'mb-2 text-2xl font-bold text-gray-900',
                children: t('kitchen.title'),
              }),
              _jsx('p', {
                className: 'text-sm text-gray-600',
                children: 'Oldest first. Auto-refresh every 3s.',
              }),
            ],
          }),
          _jsx(KitchenFilters, {
            searchQuery: searchQuery,
            onSearchChange: setSearchQuery,
          }),
        ],
      }),
      isLoading
        ? _jsx('div', {
            className: 'flex-1 p-6',
            children: _jsx('div', {
              className: 'grid h-full grid-cols-1 gap-6 lg:grid-cols-3',
              children: Array.from({ length: 3 }).map((_, i) =>
                _jsxs(
                  'div',
                  {
                    className: 'space-y-4',
                    children: [
                      _jsx(Skeleton, { className: 'h-12 w-full' }),
                      _jsx(Skeleton, { className: 'h-64 w-full' }),
                      _jsx(Skeleton, { className: 'h-48 w-full' }),
                    ],
                  },
                  i
                )
              ),
            }),
          })
        : _jsx(OrdersGrid, {
            tickets: filteredTickets,
            onStatusChange: handleStatusChange,
          }),
      _jsx(OrderDetailDrawer, {
        ticket: selectedTicket,
        open: drawerOpen,
        onClose: () => {
          setDrawerOpen(false)
          setSelectedTicket(null)
        },
        onStatusChange: handleStatusChange,
      }),
      _jsx(Sound, {
        enabled: sound,
        newTicketsCount: tickets.filter((t) => t.status === 'NEW').length,
      }),
    ],
  })
}
