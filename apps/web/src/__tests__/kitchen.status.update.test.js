import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { ordersDb } from '../test-setup'
const renderKitchenWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/kitchen')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Kitchen - Status Updates', () => {
  beforeEach(() => {
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
        lines: [
          { itemId: 'i1', name: 'Americano', qty: 1, station: 'BAR' },
          { itemId: 'i3', name: 'Cheesecake', qty: 1, station: 'COLD' },
        ],
      },
      {
        id: 't2',
        number: '#1044',
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        status: 'IN_PROGRESS',
        channel: 'TAKEAWAY',
        lines: [{ itemId: 'i2', name: 'Latte', qty: 2, station: 'BAR' }],
      },
      {
        id: 't3',
        number: '#1045',
        createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        status: 'READY',
        channel: 'DELIVERY',
        lines: [
          { itemId: 'i4', name: 'Club Sandwich', qty: 1, station: 'HOT' },
        ],
      },
    ]
  })
  it('moves NEW ticket to IN_PROGRESS when Start button is clicked', async () => {
    const user = userEvent.setup()
    await renderKitchenWithStore()
    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Find and click the Start button for the NEW order
    const startButton = screen.getByRole('button', { name: /start/i })
    await user.click(startButton)
    // Wait for the mutation to complete and UI to update
    await waitFor(() => {
      // The Start button should be gone (ticket moved to IN_PROGRESS)
      expect(
        screen.queryByRole('button', { name: /start/i })
      ).not.toBeInTheDocument()
    })
    // Verify the ticket status was updated in the mock DB
    const updatedTicket = ordersDb.tickets.find((t) => t.id === 't1')
    expect(updatedTicket?.status).toBe('IN_PROGRESS')
  })
  it('moves IN_PROGRESS ticket to READY when Mark Ready button is clicked', async () => {
    const user = userEvent.setup()
    await renderKitchenWithStore()
    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1044')).toBeInTheDocument()
    })
    // Find and click the Mark Ready button for the IN_PROGRESS order
    const readyButton = screen.getByRole('button', { name: /mark ready/i })
    await user.click(readyButton)
    // Wait for the mutation to complete
    await waitFor(() => {
      // The Mark Ready button should be gone
      expect(
        screen.queryByRole('button', { name: /mark ready/i })
      ).not.toBeInTheDocument()
    })
    // Verify the ticket status was updated in the mock DB
    const updatedTicket = ordersDb.tickets.find((t) => t.id === 't2')
    expect(updatedTicket?.status).toBe('READY')
  })
  it('moves READY ticket to SERVED when Serve button is clicked', async () => {
    const user = userEvent.setup()
    await renderKitchenWithStore()
    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1045')).toBeInTheDocument()
    })
    // Find and click the Serve button for the READY order
    const serveButton = screen.getByRole('button', { name: /serve/i })
    await user.click(serveButton)
    // Wait for the mutation to complete and ticket to disappear (SERVED tickets are filtered out)
    await waitFor(() => {
      expect(screen.queryByText('#1045')).not.toBeInTheDocument()
    })
    // Verify the ticket status was updated in the mock DB
    const updatedTicket = ordersDb.tickets.find((t) => t.id === 't3')
    expect(updatedTicket?.status).toBe('SERVED')
  })
  it('updates column counts when tickets change status', async () => {
    const user = userEvent.setup()
    await renderKitchenWithStore()
    // Wait for initial load - should have 1 NEW, 1 IN_PROGRESS, 1 READY
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Move NEW to IN_PROGRESS
    const startButton = screen.getByRole('button', { name: /start/i })
    await user.click(startButton)
    // Wait for update - should now have 0 NEW, 2 IN_PROGRESS, 1 READY
    await waitFor(() => {
      // The Start button should be gone
      expect(
        screen.queryByRole('button', { name: /start/i })
      ).not.toBeInTheDocument()
    })
    // Should now have 2 "Mark ready" buttons (both tickets in IN_PROGRESS)
    const readyButtons = screen.getAllByRole('button', { name: /mark ready/i })
    expect(readyButtons).toHaveLength(2)
  })
  it('preserves ticket data during status transitions', async () => {
    const user = userEvent.setup()
    await renderKitchenWithStore()
    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })
    // Verify initial ticket details are present
    expect(screen.getByText('Table 5')).toBeInTheDocument()
    expect(screen.getByText('DINE IN')).toBeInTheDocument()
    expect(screen.getByText('1× Americano')).toBeInTheDocument()
    // Move ticket to IN_PROGRESS
    const startButton = screen.getByRole('button', { name: /start/i })
    await user.click(startButton)
    // Wait for update and verify details are still present
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
      expect(screen.getByText('Table 5')).toBeInTheDocument()
      expect(screen.getByText('DINE IN')).toBeInTheDocument()
      expect(screen.getByText('1× Americano')).toBeInTheDocument()
    })
  })
})
