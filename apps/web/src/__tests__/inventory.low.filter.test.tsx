import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { inventoryDb } from '../test-setup'

const renderInventoryWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/inventory')

  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}

describe('Inventory - Low Stock Filter', () => {
  beforeEach(() => {
    // Reset inventory DB with specific test data
    inventoryDb.items = [
      {
        id: 'it1',
        name: 'Espresso beans',
        sku: 'BE-001',
        category: 'Coffee',
        uom: 'kg',
        stockQty: 3,
        minQty: 5,
        reorderQty: 10,
        costPrice: 280,
        updatedAt: new Date().toISOString(),
      }, // Low stock
      {
        id: 'it2',
        name: 'Milk 1L',
        sku: 'ML-1L',
        category: 'Dairy',
        uom: 'lt',
        stockQty: 12,
        minQty: 8,
        reorderQty: 24,
        costPrice: 18,
        updatedAt: new Date().toISOString(),
      }, // OK stock
      {
        id: 'it3',
        name: 'Cups 300ml',
        sku: 'CP-300',
        category: 'Disposables',
        uom: 'pcs',
        stockQty: 0,
        minQty: 200,
        reorderQty: 500,
        costPrice: 0.6,
        updatedAt: new Date().toISOString(),
      }, // Out of stock
      {
        id: 'it4',
        name: 'Sugar packets',
        sku: 'SG-001',
        category: 'Supplies',
        uom: 'pcs',
        stockQty: 2,
        minQty: 10,
        reorderQty: 50,
        costPrice: 0.1,
        updatedAt: new Date().toISOString(),
      }, // Low stock
    ]
  })

  it('shows all items by default', async () => {
    await renderInventoryWithStore()

    // Wait for data to load
    expect(await screen.findByText('Espresso beans')).toBeInTheDocument()
    expect(screen.getByText('Milk 1L')).toBeInTheDocument()
    expect(screen.getByText('Cups 300ml')).toBeInTheDocument()
    expect(screen.getByText('Sugar packets')).toBeInTheDocument()
  })

  it('filters to show only low stock items when Low filter is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })

    // Click the Low status filter
    const lowButton = screen.getByRole('button', { name: /low/i })
    await user.click(lowButton)

    // Wait for filter to apply
    await waitFor(() => {
      // Should show low stock items (stockQty > 0 && stockQty <= minQty)
      expect(screen.getByText('Espresso beans')).toBeInTheDocument() // 3 <= 5
      expect(screen.getByText('Sugar packets')).toBeInTheDocument() // 2 <= 10

      // Should NOT show OK or out of stock items
      expect(screen.queryByText('Milk 1L')).not.toBeInTheDocument() // 12 > 8 (OK)
      expect(screen.queryByText('Cups 300ml')).not.toBeInTheDocument() // 0 (out)
    })
  })

  it('filters to show only out of stock items when Out filter is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })

    // Click the Out status filter
    const outButton = screen.getByRole('button', { name: /out/i })
    await user.click(outButton)

    // Wait for filter to apply
    await waitFor(() => {
      // Should show only out of stock items (stockQty <= 0)
      expect(screen.getByText('Cups 300ml')).toBeInTheDocument() // 0

      // Should NOT show low or OK stock items
      expect(screen.queryByText('Espresso beans')).not.toBeInTheDocument()
      expect(screen.queryByText('Milk 1L')).not.toBeInTheDocument()
      expect(screen.queryByText('Sugar packets')).not.toBeInTheDocument()
    })
  })

  it('filters to show only OK stock items when OK filter is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })

    // Click the OK status filter
    const okButton = screen.getByRole('button', { name: /^ok$/i })
    await user.click(okButton)

    // Wait for filter to apply
    await waitFor(() => {
      // Should show only OK stock items (stockQty > minQty)
      expect(screen.getByText('Milk 1L')).toBeInTheDocument() // 12 > 8

      // Should NOT show low or out of stock items
      expect(screen.queryByText('Espresso beans')).not.toBeInTheDocument()
      expect(screen.queryByText('Cups 300ml')).not.toBeInTheDocument()
      expect(screen.queryByText('Sugar packets')).not.toBeInTheDocument()
    })
  })

  it('returns to showing all items when All filter is clicked', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })

    // First filter to Low
    const lowButton = screen.getByRole('button', { name: /low/i })
    await user.click(lowButton)

    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
      expect(screen.queryByText('Milk 1L')).not.toBeInTheDocument()
    })

    // Then click All to show everything again
    const allButton = screen.getByRole('button', { name: /all/i })
    await user.click(allButton)

    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
      expect(screen.getByText('Milk 1L')).toBeInTheDocument()
      expect(screen.getByText('Cups 300ml')).toBeInTheDocument()
      expect(screen.getByText('Sugar packets')).toBeInTheDocument()
    })
  })

  it('combines status filter with search', async () => {
    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })

    // First apply Low filter
    const lowButton = screen.getByRole('button', { name: /low/i })
    await user.click(lowButton)

    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
      expect(screen.getByText('Sugar packets')).toBeInTheDocument()
    })

    // Then search for "sugar"
    const searchInput = screen.getByPlaceholderText('Search items…')
    await user.type(searchInput, 'sugar')

    await waitFor(() => {
      // Should show only Sugar packets (low stock + matches search)
      expect(screen.getByText('Sugar packets')).toBeInTheDocument()
      expect(screen.queryByText('Espresso beans')).not.toBeInTheDocument()
    })
  })

  it('shows appropriate empty state when no items match filter', async () => {
    // Set up data with no low stock items
    inventoryDb.items = [
      {
        id: 'it1',
        name: 'Milk 1L',
        sku: 'ML-1L',
        category: 'Dairy',
        uom: 'lt',
        stockQty: 12,
        minQty: 8,
        reorderQty: 24,
        costPrice: 18,
        updatedAt: new Date().toISOString(),
      }, // OK stock
    ]

    const user = userEvent.setup()
    await renderInventoryWithStore()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Milk 1L')).toBeInTheDocument()
    })

    // Click Low filter (should show no items)
    const lowButton = screen.getByRole('button', { name: /low/i })
    await user.click(lowButton)

    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument()
    })
  })
})
