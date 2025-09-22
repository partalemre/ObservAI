import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { usePOS } from '../store/posStore'
const renderPOSWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/pos')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('POS - Search and Filter', () => {
  beforeEach(() => {
    // Clear POS store
    usePOS.getState().clear()
  })
  it('displays all products initially', async () => {
    await renderPOSWithStore()
    // Wait for all products to load
    expect(await screen.findByText('Americano')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
    expect(screen.getByText('Cheesecake')).toBeInTheDocument()
  })
  it('filters products by search query', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    await screen.findByText('Americano')
    // Search for "latte"
    const searchInput = screen.getByPlaceholderText('Search products…')
    await user.type(searchInput, 'latte')
    // Should show only Latte
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })
  })
  it('shows no results for non-matching search', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    await screen.findByText('Americano')
    // Search for non-existing product
    const searchInput = screen.getByPlaceholderText('Search products…')
    await user.type(searchInput, 'pizza')
    // Should show no products found message
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument()
      expect(screen.getByText('No products match "pizza"')).toBeInTheDocument()
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
    })
  })
  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    await screen.findByText('Americano')
    // Search for something
    const searchInput = screen.getByPlaceholderText('Search products…')
    await user.type(searchInput, 'latte')
    // Wait for filter to apply
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
    })
    // Click clear button (X icon)
    const clearButton = screen.getByRole('button', { name: /x/i })
    await user.click(clearButton)
    // Should show all products again
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })
    // Search input should be empty
    expect(searchInput).toHaveValue('')
  })
  it('filters products by category', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products and categories to load
    await screen.findByText('Americano')
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Desserts')).toBeInTheDocument()
    // Click Coffee category
    const coffeeTab = screen.getByRole('button', { name: /coffee/i })
    await user.click(coffeeTab)
    // Should show only coffee items
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })
  })
  it('filters products by desserts category', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products and categories to load
    await screen.findByText('Americano')
    // Click Desserts category
    const dessertsTab = screen.getByRole('button', { name: /desserts/i })
    await user.click(dessertsTab)
    // Should show only dessert items
    await waitFor(() => {
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
      expect(screen.queryByText('Latte')).not.toBeInTheDocument()
    })
  })
  it('shows all products when "All" category is selected', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    await screen.findByText('Americano')
    // First filter by Coffee
    const coffeeTab = screen.getByRole('button', { name: /coffee/i })
    await user.click(coffeeTab)
    // Wait for filter to apply
    await waitFor(() => {
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })
    // Click "All" category
    const allTab = screen.getByRole('button', { name: /all/i })
    await user.click(allTab)
    // Should show all products again
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
      expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    })
  })
  it('combines search and category filters', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for products to load
    await screen.findByText('Americano')
    // Filter by Coffee category first
    const coffeeTab = screen.getByRole('button', { name: /coffee/i })
    await user.click(coffeeTab)
    // Then search for "americano"
    const searchInput = screen.getByPlaceholderText('Search products…')
    await user.type(searchInput, 'americano')
    // Should show only Americano (matches both coffee category and search)
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.queryByText('Latte')).not.toBeInTheDocument()
      expect(screen.queryByText('Cheesecake')).not.toBeInTheDocument()
    })
  })
  it('shows category indicator when active', async () => {
    const user = userEvent.setup()
    await renderPOSWithStore()
    // Wait for categories to load
    await screen.findByText('Coffee')
    // Click Coffee category
    const coffeeTab = screen.getByRole('button', { name: /coffee/i })
    await user.click(coffeeTab)
    // Coffee tab should have active styling (brand color and underline)
    expect(coffeeTab).toHaveClass('text-brand')
    // Should have gradient underline (check for gradient class)
    const underline = coffeeTab.querySelector('.bg-gradient-to-r')
    expect(underline).toBeInTheDocument()
  })
})
