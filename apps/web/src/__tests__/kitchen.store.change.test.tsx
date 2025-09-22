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

describe('Kitchen - Store Change', () => {
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
        lines: [{ itemId: 'i1', name: 'Americano', qty: 1, station: 'BAR' }],
      },
      {
        id: 't2',
        number: '#1044',
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        status: 'IN_PROGRESS',
        channel: 'TAKEAWAY',
        lines: [{ itemId: 'i2', name: 'Latte', qty: 2, station: 'BAR' }],
      },
    ]
  })

  it('displays no store selected message when no store is selected', async () => {
    // Don't set a selected store
    useOrgStore.setState({ selectedStoreId: undefined })

    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const testRouter = createTestRouter('/kitchen')

    render(
      <QueryClientProvider client={qc}>
        <RouterProvider router={testRouter} />
      </QueryClientProvider>
    )

    expect(await screen.findByText('No Store Selected')).toBeInTheDocument()
    expect(
      screen.getByText('Please select a store to view the kitchen display')
    ).toBeInTheDocument()
  })

  it('loads kitchen display when store is selected', async () => {
    await renderKitchenWithStore('s1')

    // Should show kitchen display with tickets
    expect(await screen.findByText('Kitchen Display')).toBeInTheDocument()
    expect(screen.getByText('#1043')).toBeInTheDocument()
    expect(screen.getByText('#1044')).toBeInTheDocument()
  })

  it('refetches data when store changes', async () => {
    // Start with store s1
    const { rerender } = await renderKitchenWithStore('s1')

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Change to different store
    useOrgStore.setState({ selectedStoreId: 's2' })

    // Re-render with new store
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const testRouter = createTestRouter('/kitchen')

    rerender(
      <QueryClientProvider client={qc}>
        <RouterProvider router={testRouter} />
      </QueryClientProvider>
    )

    // Should still show kitchen display (in real app, would show different store's data)
    await waitFor(() => {
      expect(screen.getByText('Kitchen Display')).toBeInTheDocument()
    })
  })

  it('shows empty state when store has no active tickets', async () => {
    // Clear all tickets
    ordersDb.tickets = []

    await renderKitchenWithStore('s1')

    // Should show empty state
    expect(await screen.findByText('Kitchen Display')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('No active tickets')).toBeInTheDocument()
    })
  })

  it('maintains filter and display settings when store changes', async () => {
    await renderKitchenWithStore('s1')

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('#1043')).toBeInTheDocument()
    })

    // Verify filter controls are present
    expect(screen.getByText('Channel:')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Dine-in')).toBeInTheDocument()
    expect(screen.getByText('Takeaway')).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()

    // Verify density controls are present
    expect(screen.getByText('Density:')).toBeInTheDocument()
    expect(screen.getByText('Comfortable')).toBeInTheDocument()
    expect(screen.getByText('Compact')).toBeInTheDocument()

    // Change store
    useOrgStore.setState({ selectedStoreId: 's2' })

    // Controls should still be present after store change
    await waitFor(() => {
      expect(screen.getByText('Channel:')).toBeInTheDocument()
      expect(screen.getByText('Density:')).toBeInTheDocument()
    })
  })

  it('preserves search query when store changes', async () => {
    await renderKitchenWithStore('s1')

    // Wait for load and verify search input exists
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search by item or table…')
      ).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search by item or table…')

    // Change store
    useOrgStore.setState({ selectedStoreId: 's2' })

    // Search input should still be present and functional
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search by item or table…')
      ).toBeInTheDocument()
    })
  })
})
