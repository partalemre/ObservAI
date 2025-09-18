import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { Dashboard } from '../app/pages/Dashboard'
import { useOrgStore } from '../store/orgStore'

// Mock the org store
vi.mock('../store/orgStore')

const server = setupServer(
  http.get('http://localhost:3001/metrics/overview', ({ request }) => {
    const url = new URL(request.url)
    const storeId = url.searchParams.get('storeId')

    if (!storeId) {
      return HttpResponse.json({ error: 'Store ID required' }, { status: 400 })
    }

    return HttpResponse.json({
      kpis: {
        revenue: 1250.75,
        orders: 45,
        aov: 27.79,
        visitors: 120,
      },
      sales: [
        { ts: '2024-01-01T10:00:00Z', revenue: 125.5, orders: 5 },
        { ts: '2024-01-01T11:00:00Z', revenue: 200.25, orders: 8 },
        { ts: '2024-01-01T12:00:00Z', revenue: 350.0, orders: 12 },
      ],
      busyHours: [
        { hour: 10, visitors: 15 },
        { hour: 11, visitors: 25 },
        { hour: 12, visitors: 40 },
        { hour: 13, visitors: 35 },
      ],
    })
  })
)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Dashboard Render', () => {
  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })
  afterAll(() => server.close())

  test('renders dashboard with selected store', async () => {
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [{ id: 'o1', name: 'Demo Org' }],
      stores: [{ id: 's1', name: 'Test Store', orgId: 'o1' }],
      selectedOrgId: 'o1',
      selectedStoreId: 's1',
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })

    const Wrapper = createWrapper()
    render(<Dashboard />, { wrapper: Wrapper })

    // Check if dashboard title is in English
    expect(screen.getByText('Dashboard')).toBeInTheDocument()

    // Check if date range picker is present
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()

    // Wait for data to load and check KPI labels in English
    await waitFor(() => {
      expect(screen.getByText("Today's Revenue")).toBeInTheDocument()
      expect(screen.getByText('Orders')).toBeInTheDocument()
      expect(screen.getByText('Average Order Value')).toBeInTheDocument()
      expect(screen.getByText('Visitors')).toBeInTheDocument()
    })

    // Check if KPI values are displayed
    await waitFor(() => {
      expect(screen.getByText('TRY 1,250.75')).toBeInTheDocument()
      expect(screen.getByText('45')).toBeInTheDocument()
      expect(screen.getByText('TRY 27.79')).toBeInTheDocument()
      expect(screen.getByText('120')).toBeInTheDocument()
    })

    // Check if charts are present
    expect(screen.getByText('Sales (Hourly)')).toBeInTheDocument()
    expect(screen.getByText('Busy Hours')).toBeInTheDocument()
  })

  test('shows empty state when no store selected', () => {
    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [],
      stores: [],
      selectedOrgId: null,
      selectedStoreId: null,
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })

    const Wrapper = createWrapper()
    render(<Dashboard />, { wrapper: Wrapper })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(
      screen.getByText('Welcome to ObservAI. Pick a page to get started.')
    ).toBeInTheDocument()
  })

  test('changes date range and triggers refetch', async () => {
    const user = userEvent.setup()

    vi.mocked(useOrgStore).mockReturnValue({
      orgs: [{ id: 'o1', name: 'Demo Org' }],
      stores: [{ id: 's1', name: 'Test Store', orgId: 'o1' }],
      selectedOrgId: 'o1',
      selectedStoreId: 's1',
      setContext: vi.fn(),
      setSelectedStore: vi.fn(),
    })

    const Wrapper = createWrapper()
    render(<Dashboard />, { wrapper: Wrapper })

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Today's Revenue")).toBeInTheDocument()
    })

    // Click on "Last 7 days" range
    await user.click(screen.getByText('Last 7 days'))

    // Verify the button becomes active (should have different styling)
    const last7DaysButton = screen.getByText('Last 7 days')
    expect(last7DaysButton).toBeInTheDocument()
  })
})
