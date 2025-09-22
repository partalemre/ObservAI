import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { menuDb } from '../test-setup'
const renderMenuWithStore = async (storeId = 's1') => {
  useOrgStore.setState({ selectedStoreId: storeId })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/menu')
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('Menu - Assign Groups', () => {
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
      {
        id: 'grp-2',
        name: 'Size',
        min: 1,
        max: 1,
        options: [
          { id: 'opt-3', name: 'Small', priceDelta: 0 },
          { id: 'opt-4', name: 'Large', priceDelta: 5 },
        ],
      },
    ]
  })
  it('shows current group assignments', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Check group indicators in the table
    const groupCells = screen.getAllByText(/groups|None/)
    expect(groupCells[0]).toHaveTextContent('None') // Americano has no groups
    expect(groupCells[1]).toHaveTextContent('1 groups') // Latte has 1 group
  })
  it('assigns modifier groups to an item', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Americano')).toBeInTheDocument()
    })
    // Click "Assign groups" for Americano
    const assignButtons = screen.getAllByText('Assign groups')
    await userEvent.click(assignButtons[0])
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Assign modifier groups')).toBeInTheDocument()
      expect(
        screen.getByText('Assigning modifier groups to: Americano')
      ).toBeInTheDocument()
    })
    // Should see available groups
    expect(screen.getByText('Milk type')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    // Add Milk type group
    await userEvent.click(screen.getByText('Add')) // First Add button for Milk type
    // Should now appear in selected groups
    await waitFor(() => {
      expect(screen.getByText('Selected Groups')).toBeInTheDocument()
    })
    // Add Size group
    const addButtons = screen.getAllByText('Add')
    await userEvent.click(addButtons[0]) // Size should be the remaining Add button
    // Save assignment
    await userEvent.click(screen.getByText('Save assignment'))
    // Wait for dialog to close and changes to be reflected
    await waitFor(() => {
      expect(
        screen.queryByText('Assign modifier groups')
      ).not.toBeInTheDocument()
    })
    // Check that Americano now shows 2 groups
    await waitFor(() => {
      const americano = menuDb.items.find((i) => i.name === 'Americano')
      expect(americano?.modifierGroupIds).toHaveLength(2)
      expect(americano?.modifierGroupIds).toContain('grp-1')
      expect(americano?.modifierGroupIds).toContain('grp-2')
    })
  })
  it('reorders assigned groups', async () => {
    // Start with Latte that already has a group assigned
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Click "Assign groups" for Latte
    const assignButtons = screen.getAllByText('Assign groups')
    await userEvent.click(assignButtons[1]) // Latte should be second
    await waitFor(() => {
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })
    // Add Size group to Latte
    await userEvent.click(screen.getByText('Add'))
    // Now we should have 2 groups in selected, let's reorder them
    await waitFor(() => {
      expect(screen.getAllByText('↑')).toHaveLength(1) // One up button
      expect(screen.getAllByText('↓')).toHaveLength(1) // One down button
    })
    // Move Size up (it should be second, so moving up makes it first)
    await userEvent.click(screen.getByText('↑'))
    // Save assignment
    await userEvent.click(screen.getByText('Save assignment'))
    await waitFor(() => {
      const latte = menuDb.items.find((i) => i.name === 'Latte')
      expect(latte?.modifierGroupIds).toHaveLength(2)
      // Order should now be Size first, then Milk type
      expect(latte?.modifierGroupIds[0]).toBe('grp-2') // Size
      expect(latte?.modifierGroupIds[1]).toBe('grp-1') // Milk type
    })
  })
  it('removes assigned groups', async () => {
    await renderMenuWithStore()
    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument()
    })
    // Click "Assign groups" for Latte (which has 1 group)
    const assignButtons = screen.getAllByText('Assign groups')
    await userEvent.click(assignButtons[1])
    await waitFor(() => {
      expect(screen.getByText('Selected Groups')).toBeInTheDocument()
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })
    // Remove the assigned group
    await userEvent.click(screen.getByText('✕'))
    // Save assignment
    await userEvent.click(screen.getByText('Save assignment'))
    await waitFor(() => {
      const latte = menuDb.items.find((i) => i.name === 'Latte')
      expect(latte?.modifierGroupIds).toHaveLength(0)
    })
  })
})
