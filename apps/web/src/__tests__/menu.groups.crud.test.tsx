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

describe('Menu - Modifier Groups CRUD', () => {
  beforeEach(() => {
    // Reset menu DB to initial state
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

  it('displays existing modifier groups', async () => {
    await renderMenuWithStore()

    // Switch to Modifier groups tab
    await userEvent.click(screen.getByText('Modifier groups'))

    await waitFor(() => {
      expect(screen.getByText('Milk type')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // min
      expect(screen.getByText('1')).toBeInTheDocument() // max
      expect(screen.getByText('2 options')).toBeInTheDocument()
    })
  })

  it('creates a new modifier group with options', async () => {
    await renderMenuWithStore()

    // Switch to Modifier groups tab
    await userEvent.click(screen.getByText('Modifier groups'))

    // Click New group button
    await userEvent.click(screen.getByText('New group'))

    // Fill in form
    await userEvent.type(
      screen.getByPlaceholderText('Enter group name'),
      'Size'
    )
    await userEvent.clear(screen.getByDisplayValue('0'))
    await userEvent.type(screen.getByDisplayValue('0'), '1')
    await userEvent.clear(screen.getByDisplayValue('1'))
    await userEvent.type(screen.getByDisplayValue('1'), '1')

    // Fill in first option
    await userEvent.type(screen.getByPlaceholderText('Option name'), 'Small')
    await userEvent.type(screen.getByPlaceholderText('Price delta'), '0')

    // Add second option
    await userEvent.click(screen.getByText('Add option'))

    const optionInputs = screen.getAllByPlaceholderText('Option name')
    const deltaInputs = screen.getAllByPlaceholderText('Price delta')

    await userEvent.type(optionInputs[1], 'Large')
    await userEvent.type(deltaInputs[1], '5')

    // Submit form
    await userEvent.click(screen.getByText('Save'))

    // Wait for group to appear
    await waitFor(() => {
      expect(screen.getByText('Size')).toBeInTheDocument()
      expect(screen.getByText('2 options')).toBeInTheDocument()
    })

    // Verify it was added to the database
    const newGroup = menuDb.groups.find((g) => g.name === 'Size')
    expect(newGroup).toBeDefined()
    expect(newGroup?.options).toHaveLength(2)
    expect(newGroup?.options[0].name).toBe('Small')
    expect(newGroup?.options[1].name).toBe('Large')
    expect(newGroup?.options[1].priceDelta).toBe(5)
  })

  it('edits a modifier group', async () => {
    await renderMenuWithStore()

    // Switch to Modifier groups tab
    await userEvent.click(screen.getByText('Modifier groups'))

    await waitFor(() => {
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })

    // Click edit button
    await userEvent.click(screen.getByText('Edit'))

    // Change min/max values
    const minInput = screen.getByDisplayValue('1')
    await userEvent.clear(minInput)
    await userEvent.type(minInput, '0')

    const maxInput = screen.getAllByDisplayValue('1')[1] // Second input with value 1
    await userEvent.clear(maxInput)
    await userEvent.type(maxInput, '2')

    // Submit form
    await userEvent.click(screen.getByText('Save'))

    // Wait for changes to appear
    await waitFor(() => {
      const milkGroup = menuDb.groups.find((g) => g.name === 'Milk type')
      expect(milkGroup?.min).toBe(0)
      expect(milkGroup?.max).toBe(2)
    })
  })

  it('deletes a modifier group', async () => {
    await renderMenuWithStore()

    // Switch to Modifier groups tab
    await userEvent.click(screen.getByText('Modifier groups'))

    await waitFor(() => {
      expect(screen.getByText('Milk type')).toBeInTheDocument()
    })

    // Click delete button
    await userEvent.click(screen.getByText('Delete'))

    // Confirm deletion
    await userEvent.click(screen.getByText('Delete'))

    // Wait for group to be removed
    await waitFor(() => {
      expect(screen.queryByText('Milk type')).not.toBeInTheDocument()
      expect(screen.getByText('No modifier groups')).toBeInTheDocument()
    })

    // Verify it was removed from the database
    expect(menuDb.groups.find((g) => g.name === 'Milk type')).toBeUndefined()
  })
})
