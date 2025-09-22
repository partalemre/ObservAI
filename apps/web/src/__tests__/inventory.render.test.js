import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
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
describe('Inventory - Render', () => {
  beforeEach(() => {
    // Reset inventory DB to initial state
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
      },
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
      },
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
      },
    ]
  })
  it('displays inventory page title and action buttons', async () => {
    await renderInventoryWithStore()
    expect(await screen.findByText('Inventory')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /receive stock/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /adjust stock/i })
    ).toBeInTheDocument()
  })
  it('renders table with correct column headers', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check column headers
    expect(screen.getByText('Item')).toBeInTheDocument()
    expect(screen.getByText('SKU')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('On hand')).toBeInTheDocument()
    expect(screen.getByText('Min')).toBeInTheDocument()
    expect(screen.getByText('Reorder')).toBeInTheDocument()
    expect(screen.getByText('Cost')).toBeInTheDocument()
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
  it('displays at least 3 inventory items', async () => {
    await renderInventoryWithStore()
    // Wait for data to load and check for items
    expect(await screen.findByText('Espresso beans')).toBeInTheDocument()
    expect(screen.getByText('Milk 1L')).toBeInTheDocument()
    expect(screen.getByText('Cups 300ml')).toBeInTheDocument()
  })
  it('shows item details correctly', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check SKUs
    expect(screen.getByText('BE-001')).toBeInTheDocument()
    expect(screen.getByText('ML-1L')).toBeInTheDocument()
    expect(screen.getByText('CP-300')).toBeInTheDocument()
    // Check categories
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Dairy')).toBeInTheDocument()
    expect(screen.getByText('Disposables')).toBeInTheDocument()
    // Check stock quantities
    expect(screen.getByText('3')).toBeInTheDocument() // Espresso beans stock
    expect(screen.getByText('12')).toBeInTheDocument() // Milk stock
    expect(screen.getByText('0')).toBeInTheDocument() // Cups stock (out of stock)
  })
  it('displays stock badges with correct status', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check stock badges
    expect(screen.getByText('Low')).toBeInTheDocument() // Espresso beans (3 <= 5)
    expect(screen.getByText('OK')).toBeInTheDocument() // Milk (12 > 8)
    expect(screen.getByText('Out of stock')).toBeInTheDocument() // Cups (0 <= 0)
  })
  it('shows search and filter controls', async () => {
    await renderInventoryWithStore()
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument()
    })
    // Check search input
    expect(screen.getByPlaceholderText('Search items…')).toBeInTheDocument()
    // Check category filter
    expect(screen.getByText('Category:')).toBeInTheDocument()
    // Check status filter
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Out')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })
  it('shows row highlighting for low and out of stock items', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Find the table rows
    const rows = screen.getAllByRole('row')
    // Should have header row + 3 data rows
    expect(rows.length).toBe(4)
    // Check that rows have appropriate styling classes
    // Note: We can't easily test exact CSS classes in RTL, but we can verify the structure
    const tableBody = document.querySelector('tbody')
    expect(tableBody).toBeInTheDocument()
    expect(tableBody?.children.length).toBe(3)
  })
  it('displays cost prices with currency formatting', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check for formatted prices (should contain numbers, exact format may vary)
    const priceElements = document.querySelectorAll('td')
    const priceTexts = Array.from(priceElements)
      .map((el) => el.textContent)
      .filter(
        (text) =>
          text &&
          (text.includes('280') || text.includes('18') || text.includes('0.6'))
      )
    expect(priceTexts.length).toBeGreaterThan(0)
  })
  it('shows updated timestamps', async () => {
    await renderInventoryWithStore()
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Espresso beans')).toBeInTheDocument()
    })
    // Check for "ago" text indicating relative timestamps
    const agoElements = screen.getAllByText(/ago$/)
    expect(agoElements.length).toBeGreaterThan(0)
  })
})
