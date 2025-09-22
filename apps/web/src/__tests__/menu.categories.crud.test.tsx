import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
import { RouterProvider } from 'react-router-dom'
import { useOrgStore } from '../store/orgStore'
import { menuDb } from '../test-setup'

const renderMenuWithStore = async (storeId = 's1') => {
  // Set selected store
  useOrgStore.setState({ selectedStoreId: storeId })

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter('/menu')

  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}

describe('Menu - Categories CRUD', () => {
  beforeEach(() => {
    // Reset menu DB to initial state
    menuDb.categories = [
      { id: 'cat-1', name: 'Coffee', sort: 1, active: true },
      { id: 'cat-2', name: 'Desserts', sort: 2, active: true },
    ]
  })

  it('displays existing categories', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
      expect(screen.getByText('Desserts')).toBeInTheDocument()
    })
  })

  it('creates a new category', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    // Click New category button
    await userEvent.click(screen.getByText('New category'))

    // Fill in form
    await userEvent.type(
      screen.getByPlaceholderText('Enter category name'),
      'Beverages'
    )

    // Submit form
    await userEvent.click(screen.getByText('Save'))

    // Wait for category to appear
    await waitFor(() => {
      expect(screen.getByText('Beverages')).toBeInTheDocument()
    })

    // Verify it was added to the database
    expect(menuDb.categories.find((c) => c.name === 'Beverages')).toBeDefined()
  })

  it('edits a category name', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    // Find Coffee category and click edit
    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })

    // Click edit button for Coffee
    const editButtons = screen.getAllByText('Edit')
    await userEvent.click(editButtons[0])

    // Clear and type new name
    const nameInput = screen.getByDisplayValue('Coffee')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Hot Beverages')

    // Submit form
    await userEvent.click(screen.getByText('Save'))

    // Wait for updated name to appear
    await waitFor(() => {
      expect(screen.getByText('Hot Beverages')).toBeInTheDocument()
      expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
    })
  })

  it('moves category up and down', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
      expect(screen.getByText('Desserts')).toBeInTheDocument()
    })

    // Get initial order
    const initialOrder = menuDb.categories
      .sort((a, b) => a.sort - b.sort)
      .map((c) => c.name)
    expect(initialOrder).toEqual(['Coffee', 'Desserts'])

    // Move Desserts up (should move Coffee down)
    const moveUpButtons = screen.getAllByText('↑')
    await userEvent.click(moveUpButtons[1]) // Click up button for Desserts

    await waitFor(() => {
      const newOrder = menuDb.categories
        .sort((a, b) => a.sort - b.sort)
        .map((c) => c.name)
      expect(newOrder).toEqual(['Desserts', 'Coffee'])
    })
  })

  it('toggles category active status', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })

    // Find and toggle the active checkbox for Coffee
    const activeCheckboxes = screen.getAllByRole('checkbox')
    const coffeeActiveCheckbox = activeCheckboxes[0] // First checkbox should be for Coffee

    expect(coffeeActiveCheckbox).toBeChecked()
    await userEvent.click(coffeeActiveCheckbox)

    await waitFor(() => {
      expect(menuDb.categories.find((c) => c.name === 'Coffee')?.active).toBe(
        false
      )
    })
  })

  it('deletes a category', async () => {
    await renderMenuWithStore()

    // Switch to Categories tab
    await userEvent.click(screen.getByText('Categories'))

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })

    // Click delete button for Coffee
    const deleteButtons = screen.getAllByText('Delete')
    await userEvent.click(deleteButtons[0])

    // Confirm deletion
    await userEvent.click(screen.getByText('Delete'))

    // Wait for category to be removed
    await waitFor(() => {
      expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
    })

    // Verify it was removed from the database
    expect(menuDb.categories.find((c) => c.name === 'Coffee')).toBeUndefined()
  })
})
