import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { vi, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// helpers
const ok = <T>(json: T) => HttpResponse.json(json, { status: 200 })
const unauthorized = (msg = 'Unauthorized') =>
  HttpResponse.json({ message: msg }, { status: 401 })

// --- In-memory orders DB for tests ---
type DB = { tickets: any[] }
export const ordersDb: DB = {
  tickets: [
    {
      id: 't1',
      number: '#1043',
      createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      status: 'NEW',
      channel: 'DINE_IN',
      tableNo: '5',
      priority: false,
      lines: [
        { itemId: 'i1', name: 'Americano', qty: 1, station: 'BAR' },
        { itemId: 'i3', name: 'Cheesecake', qty: 1, station: 'COLD' },
      ],
    },
    {
      id: 't2',
      number: '#1044',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      status: 'IN_PROGRESS',
      channel: 'TAKEAWAY',
      lines: [{ itemId: 'i2', name: 'Latte', qty: 2, station: 'BAR' }],
    },
    {
      id: 't3',
      number: '#1045',
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      status: 'READY',
      channel: 'DELIVERY',
      lines: [{ itemId: 'i4', name: 'Club Sandwich', qty: 1, station: 'HOT' }],
    },
  ],
}

// (helper for tests to insert a new ticket)
export const seedOrder = (ticket: any) => {
  ordersDb.tickets.unshift(ticket)
}

// --- In-memory inventory DB ---
type InvDB = { items: any[] }
export const inventoryDb: InvDB = {
  items: [
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
  ],
}

export const handlers = [
  // Login: "fail" içeren email ya da "wrong" şifre → 401
  http.post('*/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as any
    if ((email && String(email).includes('fail')) || password === 'wrong') {
      return unauthorized()
    }
    return ok({ token: 'test-token' })
  }),

  // Current user
  http.get('*/me', () =>
    ok({
      user: {
        id: 'u1',
        email: 'demo@obs.ai',
        name: 'Demo User',
        roles: ['manager'],
      },
      orgs: [{ id: 'o1', name: 'Demo Group' }],
      stores: [
        { id: 's1', name: 'Central Store', orgId: 'o1' },
        { id: 's2', name: 'High Street', orgId: 'o1' },
      ],
    })
  ),

  // Dashboard metrics (tutarlı fixture)
  http.get('*/metrics/overview', () =>
    ok({
      kpis: { revenue: 7250.0, orders: 82, aov: 88.4, visitors: 150 },
      sales: Array.from({ length: 6 }).map((_, i) => ({
        ts: new Date(Date.now() + i * 3600_000).toISOString(),
        revenue: 1000 + i * 250,
        orders: 10 + i * 3,
      })),
      busyHours: [
        { hour: 12, visitors: 45 },
        { hour: 13, visitors: 52 },
      ],
    })
  ),

  // POS Catalog APIs
  http.get('*/catalog/categories', () =>
    ok([
      { id: 'c1', name: 'Coffee', sort: 1 },
      { id: 'c2', name: 'Desserts', sort: 2 },
    ])
  ),

  http.get('*/catalog/items', () =>
    ok([
      { id: 'i1', name: 'Americano', price: 45, categoryId: 'c1' },
      {
        id: 'i2',
        name: 'Latte',
        price: 60,
        categoryId: 'c1',
        modifierGroupIds: ['m1'],
      },
      { id: 'i3', name: 'Cheesecake', price: 80, categoryId: 'c2' },
    ])
  ),

  http.get('*/catalog/modifiers', () =>
    ok([
      {
        id: 'm1',
        name: 'Milk type',
        min: 1,
        max: 1,
        options: [
          { id: 'o1', name: 'Full-fat', priceDelta: 0 },
          { id: 'o2', name: 'Oat milk', priceDelta: 6 },
        ],
      },
    ])
  ),

  // Orders API
  http.post('*/orders', async ({ request }) => {
    const body = (await request.json()) as any
    if (!body?.lines?.length) {
      return HttpResponse.json({ message: 'No lines' }, { status: 400 })
    }
    return ok({ orderId: 'ORD-1001' })
  }),

  // Kitchen Orders Feed
  http.get('*/orders/feed', ({ request }) => {
    const url = new URL(request.url)
    const _storeId = url.searchParams.get('storeId')
    // In tests, ignore storeId; return non-served
    const tickets = ordersDb.tickets.filter((t) => t.status !== 'SERVED')
    return ok({ tickets })
  }),

  // Order Status Update
  http.patch('*/orders/:id/status', async ({ params, request }) => {
    const { id } = params as any
    const { status } = (await request.json()) as any
    const t = ordersDb.tickets.find((x) => x.id === id)
    if (!t) return HttpResponse.json({ message: 'not found' }, { status: 404 })
    t.status = status
    return ok({ ok: true })
  }),

  // Inventory Items
  http.get('*/inventory/items', ({ request }) => {
    return HttpResponse.json({ items: inventoryDb.items }, { status: 200 })
  }),

  // Inventory Receive
  http.post('*/inventory/receive', async ({ request }) => {
    const body = (await request.json()) as any
    for (const l of body.lines || []) {
      const it = inventoryDb.items.find((i) => i.id === l.itemId)
      if (it) {
        it.stockQty += Number(l.qty || 0)
        if (typeof l.unitCost === 'number') it.costPrice = l.unitCost
        it.updatedAt = new Date().toISOString()
      }
    }
    return HttpResponse.json({ receiptId: 'RC-1001' }, { status: 200 })
  }),

  // Inventory Adjust
  http.post('*/inventory/adjust', async ({ request }) => {
    const body = (await request.json()) as any
    for (const l of body.lines || []) {
      const it = inventoryDb.items.find((i) => i.id === l.itemId)
      if (it) {
        it.stockQty += Number(l.delta || 0)
        it.updatedAt = new Date().toISOString()
      }
    }
    return HttpResponse.json({ adjustmentId: 'AD-2001' }, { status: 200 })
  }),
]

const server = setupServer(...handlers)

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock ResizeObserver for recharts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock chart dimensions for recharts
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 256,
})
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 512,
})

// MSW lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
})
