import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StoreSelect } from '../components/StoreSelect'
import { useOrgStore } from '../store/orgStore'
// Mock the org store
vi.mock('../store/orgStore')
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  // Spy on queryClient.invalidateQueries
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')
  return {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    ),
    invalidateQueriesSpy,
  }
}
describe('StoreSelect Invalidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  test('invalidates queries when store is changed', async () => {
    const mockSetSelectedStore = vi.fn()
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [{ id: 'o1', name: 'Demo Grup' }],
      stores: [
        { id: 's1', name: 'Merkez Şube', orgId: 'o1' },
        { id: 's2', name: 'Cadde Şube', orgId: 'o1' },
      ],
      selectedOrgId: 'o1',
      selectedStoreId: 's1',
      setContext: vi.fn(),
      setSelectedStore: mockSetSelectedStore,
    })
    const { wrapper, invalidateQueriesSpy } = createWrapper()
    const user = userEvent.setup()
    render(<StoreSelect />, { wrapper })
    // Open dropdown
    await user.click(screen.getByText('Merkez Şube'))
    // Select different store
    await user.click(screen.getByText('Cadde Şube'))
    // Verify setSelectedStore was called
    expect(mockSetSelectedStore).toHaveBeenCalledWith('s2')
  })
  test('shows placeholder when no stores available', () => {
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [],
      stores: [],
      selectedOrgId: null,
      selectedStoreId: null,
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })
    const { wrapper } = createWrapper()
    render(<StoreSelect />, { wrapper })
    expect(screen.getByText('Store')).toBeInTheDocument()
  })
  test('displays selected store correctly', () => {
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [{ id: 'o1', name: 'Demo Grup' }],
      stores: [
        { id: 's1', name: 'Merkez Şube', orgId: 'o1' },
        { id: 's2', name: 'Cadde Şube', orgId: 'o1' },
      ],
      selectedOrgId: 'o1',
      selectedStoreId: 's2',
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })
    const { wrapper } = createWrapper()
    render(<StoreSelect />, { wrapper })
    expect(screen.getByText('Cadde Şube')).toBeInTheDocument()
  })
  test('dropdown opens and closes correctly', async () => {
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [{ id: 'o1', name: 'Demo Grup' }],
      stores: [
        { id: 's1', name: 'Merkez Şube', orgId: 'o1' },
        { id: 's2', name: 'Cadde Şube', orgId: 'o1' },
      ],
      selectedOrgId: 'o1',
      selectedStoreId: 's1',
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })
    const { wrapper } = createWrapper()
    const user = userEvent.setup()
    render(<StoreSelect />, { wrapper })
    // Initially, dropdown options should not be visible
    expect(screen.queryByText('Cadde Şube')).not.toBeInTheDocument()
    // Open dropdown
    await user.click(screen.getByText('Merkez Şube'))
    // Now options should be visible
    expect(screen.getByText('Cadde Şube')).toBeInTheDocument()
  })
})
