import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { vi, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
// helpers
const ok = (json) => HttpResponse.json(json, { status: 200 })
const unauthorized = (msg = 'Unauthorized') =>
  HttpResponse.json({ message: msg }, { status: 401 })
export const ordersDb = {
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
export const seedOrder = (ticket) => {
  ordersDb.tickets.unshift(ticket)
}
export const inventoryDb = {
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
// --- In-memory menu DB ---
let seq = 100
const newId = (prefix) => `${prefix}-${++seq}`
export const menuDb = {
  categories: [
    { id: 'cat-1', name: 'Coffee', sort: 1, active: true },
    { id: 'cat-2', name: 'Desserts', sort: 2, active: true },
  ],
  items: [
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
  ],
  groups: [
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
  ],
}
// --- In-memory cash drawer DB ---
export const cashDb = {
  byStore: {
    s1: {
      state: {
        status: 'CLOSED',
        balance: 0,
      },
      moves: [],
    },
  },
}
export const handlers = [
  // Login: "fail" içeren email ya da "wrong" şifre → 401
  http.post('*/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
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
    const body = await request.json()
    if (!body?.lines?.length) {
      return HttpResponse.json({ message: 'No lines' }, { status: 400 })
    }
    // Record cash payment if drawer is open
    const storeId = body.storeId || 's1'
    const cashPayment = body.payments?.find((p) => p.method === 'cash')
    if (cashPayment) {
      const rec = cashDb.byStore[storeId]
      if (rec && rec.state.status === 'OPEN') {
        rec.state.balance += cashPayment.amount
        rec.moves.push({
          id: `m-${Date.now()}`,
          ts: new Date().toISOString(),
          type: 'SALE',
          amount: cashPayment.amount,
          orderId: 'ORD-1001',
        })
      }
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
    const { id } = params
    const { status } = await request.json()
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
    const body = await request.json()
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
    const body = await request.json()
    for (const l of body.lines || []) {
      const it = inventoryDb.items.find((i) => i.id === l.itemId)
      if (it) {
        it.stockQty += Number(l.delta || 0)
        it.updatedAt = new Date().toISOString()
      }
    }
    return HttpResponse.json({ adjustmentId: 'AD-2001' }, { status: 200 })
  }),
  // Menu Categories
  http.get('*/menu/categories', () =>
    ok({ categories: menuDb.categories.sort((a, b) => a.sort - b.sort) })
  ),
  http.post('*/menu/categories', async ({ request }) => {
    const body = await request.json()
    const id = newId('cat')
    menuDb.categories.push({
      id,
      name: body.name,
      sort: menuDb.categories.length + 1,
      active: true,
    })
    return ok({ id })
  }),
  http.patch('*/menu/categories/:id', async ({ params, request }) => {
    const id = params.id
    const patch = await request.json()
    const category = menuDb.categories.find((c) => c.id === id)
    if (category) Object.assign(category, patch)
    return ok({ ok: true })
  }),
  http.delete('*/menu/categories/:id', ({ params }) => {
    const id = params.id
    menuDb.categories = menuDb.categories.filter((c) => c.id !== id)
    return ok({ ok: true })
  }),
  http.put('*/menu/categories/reorder', async ({ request }) => {
    const { order } = await request.json()
    order.forEach((id, idx) => {
      const c = menuDb.categories.find((x) => x.id === id)
      if (c) c.sort = idx + 1
    })
    return ok({ ok: true })
  }),
  // Menu Items
  http.get('*/menu/items', () => ok({ items: menuDb.items })),
  http.post('*/menu/items', async ({ request }) => {
    const body = await request.json()
    const id = newId('it')
    menuDb.items.push({
      id,
      ...body,
      modifierGroupIds: body.modifierGroupIds ?? [],
    })
    return ok({ id })
  }),
  http.patch('*/menu/items/:id', async ({ params, request }) => {
    const id = params.id
    const patch = await request.json()
    const item = menuDb.items.find((i) => i.id === id)
    if (item) Object.assign(item, patch)
    return ok({ ok: true })
  }),
  http.delete('*/menu/items/:id', ({ params }) => {
    const id = params.id
    menuDb.items = menuDb.items.filter((i) => i.id !== id)
    return ok({ ok: true })
  }),
  // Modifier Groups
  http.get('*/menu/modifier-groups', () => ok({ groups: menuDb.groups })),
  http.post('*/menu/modifier-groups', async ({ request }) => {
    const b = await request.json()
    const id = newId('grp')
    menuDb.groups.push({
      id,
      name: b.name,
      min: b.min,
      max: b.max,
      options: (b.options || []).map((o) => ({ id: newId('opt'), ...o })),
    })
    return ok({ id })
  }),
  http.patch('*/menu/modifier-groups/:id', async ({ params, request }) => {
    const id = params.id
    const p = await request.json()
    const group = menuDb.groups.find((g) => g.id === id)
    if (group) Object.assign(group, p)
    return ok({ ok: true })
  }),
  http.delete('*/menu/modifier-groups/:id', ({ params }) => {
    const id = params.id
    menuDb.groups = menuDb.groups.filter((g) => g.id !== id)
    return ok({ ok: true })
  }),
  // Image Upload
  http.post('*/uploads', async () =>
    ok({ url: `https://picsum.photos/seed/${Date.now()}/200/200` })
  ),
  // Cash Drawer APIs
  // GET drawer
  http.get('*/cash-drawer', ({ request }) => {
    const url = new URL(request.url)
    const storeId = url.searchParams.get('storeId') || 's1'
    const rec =
      cashDb.byStore[storeId] ??
      (cashDb.byStore[storeId] = {
        state: { status: 'CLOSED', balance: 0 },
        moves: [],
      })
    return ok(rec.state)
  }),
  // GET movements
  http.get('*/cash-drawer/movements', ({ request }) => {
    const url = new URL(request.url)
    const storeId = url.searchParams.get('storeId') || 's1'
    const rec =
      cashDb.byStore[storeId] ??
      (cashDb.byStore[storeId] = {
        state: { status: 'CLOSED', balance: 0 },
        moves: [],
      })
    return ok({ items: rec.moves })
  }),
  // POST open
  http.post('*/cash-drawer/open', async ({ request }) => {
    const { storeId, floatAmount } = await request.json()
    const rec =
      cashDb.byStore[storeId] ??
      (cashDb.byStore[storeId] = {
        state: { status: 'CLOSED', balance: 0 },
        moves: [],
      })
    rec.state = {
      status: 'OPEN',
      openedAt: new Date().toISOString(),
      openedBy: 'clerk',
      floatAmount,
      balance: floatAmount,
    }
    return ok({ ok: true })
  }),
  // POST in
  http.post('*/cash-drawer/in', async ({ request }) => {
    const { storeId, amount, reason } = await request.json()
    const rec = cashDb.byStore[storeId]
    if (!rec || rec.state.status !== 'OPEN')
      return HttpResponse.json({ error: 'closed' }, { status: 400 })
    rec.state.balance += amount
    rec.moves.push({
      id: `m-${Date.now()}`,
      ts: new Date().toISOString(),
      type: 'CASH_IN',
      amount,
      reason,
    })
    return ok({ ok: true })
  }),
  // POST out
  http.post('*/cash-drawer/out', async ({ request }) => {
    const { storeId, amount, reason } = await request.json()
    const rec = cashDb.byStore[storeId]
    if (!rec || rec.state.status !== 'OPEN')
      return HttpResponse.json({ error: 'closed' }, { status: 400 })
    rec.state.balance -= amount
    rec.moves.push({
      id: `m-${Date.now()}`,
      ts: new Date().toISOString(),
      type: 'CASH_OUT',
      amount: -Math.abs(amount),
      reason,
    })
    return ok({ ok: true })
  }),
  // POST close
  http.post('*/cash-drawer/close', async ({ request }) => {
    const { storeId, countedTotal } = await request.json()
    const rec = cashDb.byStore[storeId]
    if (!rec) return ok({ ok: true })
    rec.moves.push({
      id: `m-${Date.now()}`,
      ts: new Date().toISOString(),
      type: 'ADJUSTMENT',
      amount: countedTotal - rec.state.balance,
      reason: 'EOD adjust',
    })
    rec.state = { status: 'CLOSED', balance: 0 }
    return ok({ ok: true })
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
beforeAll(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
})
