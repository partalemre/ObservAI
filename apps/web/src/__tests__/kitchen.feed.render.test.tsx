import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('Kitchen - Feed Render', () => {
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

  it('displays kitchen display title and subtitle', async () => {
    await renderKitchenWithStore()

    expect(await screen.findByText('Kitchen Display')).toBeInTheDocument()
    expect(
      screen.getByText('Oldest first. Auto-refresh every 3s.')
    ).toBeInTheDocument()
  })

  it('renders column headings for desktop layout', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load, then check column headers
    await waitFor(() => {
      expect(screen.getByText('New')).toBeInTheDocument()
      expect(screen.getByText('In progress')).toBeInTheDocument()
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })
  })

  it('displays ticket numbers from feed', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    expect(await screen.findByText('#1043')).toBeInTheDocument()
    expect(screen.getByText('#1044')).toBeInTheDocument()
    expect(screen.getByText('#1045')).toBeInTheDocument()
  })

  it('shows elapsed time pills', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check for elapsed time indicators (should show minutes)
    const timeElements = screen.getAllByText(/\d+m/)
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('displays channel badges', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check for channel badges
    expect(screen.getByText('DINE IN')).toBeInTheDocument()
    expect(screen.getByText('TAKEAWAY')).toBeInTheDocument()
    expect(screen.getByText('DELIVERY')).toBeInTheDocument()
  })

  it('shows table number for dine-in orders', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check for table number
    expect(screen.getByText('Table 5')).toBeInTheDocument()
  })

  it('displays order items grouped by station', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check for items
    expect(screen.getByText('1× Americano')).toBeInTheDocument()
    expect(screen.getByText('1× Cheesecake')).toBeInTheDocument()
    expect(screen.getByText('2× Latte')).toBeInTheDocument()
    expect(screen.getByText('1× Club Sandwich')).toBeInTheDocument()
  })

  it('shows action buttons based on status', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check for status-specific action buttons
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument() // NEW order
    expect(
      screen.getByRole('button', { name: /mark ready/i })
    ).toBeInTheDocument() // IN_PROGRESS order
    expect(screen.getByRole('button', { name: /serve/i })).toBeInTheDocument() // READY order
  })

  it('displays correct ticket counts in column headers', async () => {
    await renderKitchenWithStore()

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Check column counts (1 NEW, 1 IN_PROGRESS, 1 READY)
    const countElements = screen.getAllByText('1')
    expect(countElements.length).toBeGreaterThanOrEqual(3) // At least 3 columns with count of 1
  })
})
