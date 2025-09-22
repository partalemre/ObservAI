import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { menuDb } from '../test-setup'
const renderAppWithStore = async (route, storeId = 's1') => {
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter(route)
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Menu - POS Invalidation', () => {
  beforeEach(() => {
    // Reset menu DB to initial state
    menuDb.categories = [{ id: 'cat-1', name: 'Coffee', sort: 1, active: true }]
    menuDb.items = [
      {
        id: 'it-1',
        name: 'Americano',
        price: 45,
        categoryId: 'cat-1',
        active: true,
        soldOut: false,
        sku: 'AM-001',
        modifierGroupIds: [],
      },
      {
        id: 'it-2',
        name: 'Latte',
        price: 60,
        categoryId: 'cat-1',
        active: true,
        soldOut: false,
        sku: 'LA-001',
        modifierGroupIds: ['grp-1'],
      },
    ]
    menuDb.groups = [
      {
        id: 'grp-1',
        name: 'Milk type',
        min: 1,
        max: 1,
        options: [
          { id: 'opt-1', name: 'Full-fat', priceDelta: 0 },
          { id: 'opt-2', name: 'Oat milk', priceDelta: 6 },
        ],
      },
    ]
  })
  it('sold out items do not appear in POS', async () => {
    // First check that items appear in POS
    await renderAppWithStore('/pos')
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Go to menu management
    await userEvent.click(screen.getByText('Menu'))
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Mark Latte as sold out
    const soldOutCheckboxes = screen.getAllByRole('checkbox')
    const latteSoldOutCheckbox = soldOutCheckboxes[3] // Should be the sold out checkbox for Latte
    await userEvent.click(latteSoldOutCheckbox)
    await waitFor(() => {
      const latte = menuDb.items.find((i) => i.name === 'Latte')
      expect(latte?.soldOut).toBe(true)
    })
    // Go back to POS
    await userEvent.click(screen.getByText('POS'))
    // Latte should no longer appear (since it's sold out)
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.queryByText('Latte')).not.toBeInTheDocument()
    })
  })
  it('inactive items do not appear in POS', async () => {
    // First check that items appear in POS
    await renderAppWithStore('/pos')
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Go to menu management
    await userEvent.click(screen.getByText('Menu'))
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Mark Americano as inactive
    const activeCheckboxes = screen.getAllByRole('checkbox')
    const americanoActiveCheckbox = activeCheckboxes[0] // Should be the active checkbox for Americano
    await userEvent.click(americanoActiveCheckbox)
    await waitFor(() => {
      const americano = menuDb.items.find((i) => i.name === 'Americano')
      expect(americano?.active).toBe(false)
    })
    // Go back to POS
    await userEvent.click(screen.getByText('POS'))
    // Americano should no longer appear (since it's inactive)
    await waitFor(() => {
      expect(screen.queryByText('Americano')).not.toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
  })
  it('modifier groups appear in POS when item is clicked', async () => {
    // Start at POS
    await renderAppWithStore('/pos')
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Click on Latte (which has modifier groups)
    await userEvent.click(screen.getByText('Latte'))
    // Should show modifier dialog with Milk type options
    await waitFor(() => {
      expect(screen.getByText('Choose options')).toBeInTheDocument()
      expect(screen.getByText('Milk type')).toBeInTheDocument()
      expect(screen.getByText('Full-fat')).toBeInTheDocument()
      expect(screen.getByText('Oat milk')).toBeInTheDocument()
    })
  })
  it('updated modifier groups reflect in POS immediately', async () => {
    // Start at menu management
    await renderAppWithStore('/menu')
    // Go to modifier groups tab
    await userEvent.click(screen.getByText('Modifier groups'))
    await waitFor(() => {
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })
    // Edit the modifier group to add a new option
    await userEvent.click(screen.getByText('Edit'))
    // Add a new option
    await userEvent.click(screen.getByText('Add option'))
    const optionInputs = screen.getAllByPlaceholderText('Option name')
    const deltaInputs = screen.getAllByPlaceholderText('Price delta')
    await userEvent.type(optionInputs[2], 'Almond milk')
    await userEvent.type(deltaInputs[2], '8')
    // Save changes
    await userEvent.click(screen.getByText('Save'))
    await waitFor(() => {
      const milkGroup = menuDb.groups.find((g) => g.name === 'Milk type')
      expect(milkGroup?.options).toHaveLength(3)
    })
    // Go to POS
    await userEvent.click(screen.getByText('POS'))
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Click on Latte
    await userEvent.click(screen.getByText('Latte'))
    // Should now show the new Almond milk option
    await waitFor(() => {
      expect(screen.getByText('Almond milk')).toBeInTheDocument()
      expect(screen.getByText('+8')).toBeInTheDocument() // Price delta
    })
  })
})
