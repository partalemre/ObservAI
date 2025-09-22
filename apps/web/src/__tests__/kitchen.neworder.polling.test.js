import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { ordersDb, seedOrder } from '../test-setup'
const renderKitchenWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchInterval: 1000, // Faster polling for tests
      },
    },
  })
  const testRouter = createTestRouter('/kitchen')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Kitchen - New Order Polling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Reset orders DB to initial state
    ordersDb.tickets = [
      {
        id: 't1',
        number: '#1043',
        createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
        status: 'NEW',
        channel: 'DINE_IN',
        tableNo: '5',
        priority: false,
        lines: [{ itemId: 'i1', name: 'Americano', qty: 1, station: 'BAR' }],
      },
    ]
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('displays new orders when they are added to the feed', async () => {
    await renderKitchenWithStore()
    // Wait for initial ticket to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Add a new order to the database
    seedOrder({
      id: 't4',
      number: '#1046',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'TAKEAWAY',
      lines: [{ itemId: 'i5', name: 'Espresso', qty: 1, station: 'BAR' }],
    })
    // Advance timers to trigger polling
    vi.advanceTimersByTime(3500)
    // Wait for the new order to appear
    await waitFor(
      () => {
        expect(screen.getByText('#1046')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
    // Verify the new order details
    expect(screen.getByText('TAKEAWAY')).toBeInTheDocument()
    expect(screen.getByText('1× Espresso')).toBeInTheDocument()
  })
  it('updates the NEW column count when new orders arrive', async () => {
    await renderKitchenWithStore()
    // Wait for initial state - should have 1 NEW order
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Add two new orders
    seedOrder({
      id: 't4',
      number: '#1046',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'TAKEAWAY',
      lines: [{ itemId: 'i5', name: 'Espresso', qty: 1, station: 'BAR' }],
    })
    seedOrder({
      id: 't5',
      number: '#1047',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'DELIVERY',
      lines: [{ itemId: 'i6', name: 'Cappuccino', qty: 1, station: 'BAR' }],
    })
    // Advance timers to trigger polling
    vi.advanceTimersByTime(3500)
    // Wait for new orders to appear
    await waitFor(
      () => {
        expect(screen.getByText('#1046')).toBeInTheDocument()
        expect(screen.getByText('#1047')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
    // Should now have 3 NEW orders total
    expect(screen.getByText('#1043')).toBeInTheDocument()
    expect(screen.getByText('#1046')).toBeInTheDocument()
    expect(screen.getByText('#1047')).toBeInTheDocument()
  })
  it('maintains polling interval and continues to check for updates', async () => {
    await renderKitchenWithStore()
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Add an order and advance time
    seedOrder({
      id: 't4',
      number: '#1046',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'TAKEAWAY',
      lines: [{ itemId: 'i5', name: 'Espresso', qty: 1, station: 'BAR' }],
    })
    vi.advanceTimersByTime(3500)
    // Wait for first new order
    await waitFor(() => {
      expect(screen.getByText('#1046')).toBeInTheDocument()
    })
    // Add another order and advance time again
    seedOrder({
      id: 't5',
      number: '#1047',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'DELIVERY',
      lines: [{ itemId: 'i6', name: 'Cappuccino', qty: 1, station: 'BAR' }],
    })
    vi.advanceTimersByTime(3500)
    // Wait for second new order
    await waitFor(() => {
      expect(screen.getByText('#1047')).toBeInTheDocument()
    })
    // All three orders should be present
    expect(screen.getByText('#1043')).toBeInTheDocument()
    expect(screen.getByText('#1046')).toBeInTheDocument()
    expect(screen.getByText('#1047')).toBeInTheDocument()
  })
  it('handles orders with different priorities and channels', async () => {
    await renderKitchenWithStore()
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Add a priority order
    seedOrder({
      id: 't4',
      number: '#1046',
      createdAt: new Date().toISOString(),
      status: 'NEW',
      channel: 'DINE_IN',
      tableNo: '12',
      priority: true,
      lines: [{ itemId: 'i5', name: 'Espresso', qty: 1, station: 'BAR' }],
    })
    vi.advanceTimersByTime(3500)
    // Wait for priority order to appear
    await waitFor(() => {
      expect(screen.getByText('#1046')).toBeInTheDocument()
    })
    // Verify priority indicator and table number
    expect(screen.getByText('Table 12')).toBeInTheDocument()
    // Priority indicator would be a small dot - check it exists in the DOM
    const priorityIndicators = document.querySelectorAll('.bg-accent')
    expect(priorityIndicators.length).toBeGreaterThan(0)
  })
})
