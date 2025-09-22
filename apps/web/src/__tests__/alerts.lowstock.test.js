import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { inventoryDb } from '../test-setup'
const renderAlertsWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/alerts')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Alerts - Low Stock', () => {
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
    ]
  })
  it('displays alerts page title', async () => {
    await renderAlertsWithStore()
    expect(await screen.findByText('Alerts')).toBeInTheDocument()
  })
  it('shows low stock section with correct items', async () => {
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alerts')).toBeInTheDocument()
    })
    // Should show Low stock section
    expect(screen.getByText('Low stock')).toBeInTheDocument()
    // Should list both low and out of stock items
    expect(await screen.findByText('Espresso beans')).toBeInTheDocument()
    expect(screen.getByText('Cups 300ml')).toBeInTheDocument()
    // Should NOT show OK stock items
    expect(screen.queryByText('Milk 1L')).not.toBeInTheDocument()
  })
  it('displays stock badges with correct counts', async () => {
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Low stock')).toBeInTheDocument()
    })
    // Should show badges with counts
    expect(screen.getByText('1 Out')).toBeInTheDocument() // Cups 300ml
    expect(screen.getByText('1 Low')).toBeInTheDocument() // Espresso beans
  })
  it('shows stock quantities and status badges for each item', async () => {
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check stock quantities display
    expect(screen.getByText('3 / 5')).toBeInTheDocument() // Espresso beans: 3 on hand / 5 min
    expect(screen.getByText('0 / 200')).toBeInTheDocument() // Cups: 0 on hand / 200 min
    // Check status badges
    expect(screen.getByText('Low')).toBeInTheDocument() // Espresso beans
    expect(screen.getByText('Out of stock')).toBeInTheDocument() // Cups
  })
  it('displays item details including SKU and category', async () => {
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check SKU and category display
    expect(screen.getByText(/BE-001.*Coffee/)).toBeInTheDocument()
    expect(screen.getByText(/CP-300.*Disposables/)).toBeInTheDocument()
  })
  it('shows link to view all inventory', async () => {
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Low stock')).toBeInTheDocument()
    })
    // Should show link to inventory page
    const inventoryLink = screen.getByText('View all in Inventory')
    expect(inventoryLink).toBeInTheDocument()
    expect(inventoryLink.closest('a')).toHaveAttribute('href', '/inventory')
  })
  it('shows all good state when no stock issues exist', async () => {
    // Set up inventory with no issues
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
      {
        id: 'it2',
        name: 'Sugar',
        sku: 'SG-001',
        category: 'Supplies',
        uom: 'kg',
        stockQty: 15,
        minQty: 10,
        reorderQty: 20,
        costPrice: 25,
        updatedAt: new Date().toISOString(),
      }, // OK stock
    ]
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alerts')).toBeInTheDocument()
    })
    // Should show all good message
    expect(
      await screen.findByText('All good — no issues found.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('All inventory levels are above minimum thresholds.')
    ).toBeInTheDocument()
    // Should not show any stock badges or inventory link
    expect(screen.queryByText('1 Out')).not.toBeInTheDocument()
    expect(screen.queryByText('1 Low')).not.toBeInTheDocument()
    expect(screen.queryByText('View all in Inventory')).not.toBeInTheDocument()
  })
  it('limits display to first 5 items with link to view more', async () => {
    // Set up inventory with many low stock items
    inventoryDb.items = [
      {
        id: 'it1',
        name: 'Item 1',
        sku: 'I1',
        category: 'Cat1',
        uom: 'pcs',
        stockQty: 1,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it2',
        name: 'Item 2',
        sku: 'I2',
        category: 'Cat2',
        uom: 'pcs',
        stockQty: 2,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it3',
        name: 'Item 3',
        sku: 'I3',
        category: 'Cat3',
        uom: 'pcs',
        stockQty: 3,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it4',
        name: 'Item 4',
        sku: 'I4',
        category: 'Cat4',
        uom: 'pcs',
        stockQty: 4,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it5',
        name: 'Item 5',
        sku: 'I5',
        category: 'Cat5',
        uom: 'pcs',
        stockQty: 1,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it6',
        name: 'Item 6',
        sku: 'I6',
        category: 'Cat6',
        uom: 'pcs',
        stockQty: 2,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'it7',
        name: 'Item 7',
        sku: 'I7',
        category: 'Cat7',
        uom: 'pcs',
        stockQty: 3,
        minQty: 5,
        reorderQty: 10,
        costPrice: 10,
        updatedAt: new Date().toISOString(),
      },
    ]
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alerts')).toBeInTheDocument()
    })
    // Should show first 5 items
    expect(await screen.findByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
    expect(screen.getByText('Item 5')).toBeInTheDocument()
    // Should show link to view more (7 total - 5 shown = 2 more)
    expect(screen.getByText('View 2 more items')).toBeInTheDocument()
    // Should not show items 6 and 7 in the list
    expect(screen.queryByText('Item 6')).not.toBeInTheDocument()
    expect(screen.queryByText('Item 7')).not.toBeInTheDocument()
  })
  it('shows loading state while data is being fetched', async () => {
    await renderAlertsWithStore()
    // Should show loading indicators initially
    const loadingElements = screen.getAllByText((content, element) => {
      return element?.classList.contains('animate-pulse') || false
    })
    // Note: The loading state might be very brief, so this test might be flaky
    // In a real app, you might want to mock the API to delay the response for testing
  })
  it('handles empty inventory gracefully', async () => {
    // Set up empty inventory
    inventoryDb.items = []
    await renderAlertsWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Alerts')).toBeInTheDocument()
    })
    // Should show all good state
    expect(
      await screen.findByText('All good — no issues found.')
    ).toBeInTheDocument()
  })
})
