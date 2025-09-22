import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from '../app/routes/routes'
// her testte taze QueryClient
const makeWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}
const renderAppAt = (path) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const testRouter = createTestRouter(path)
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>
  )
}
describe('ObservAI — Steps 0–3 smoke', () => {
  beforeEach(() => {
    // Memory router kullandığımız için window.history'ye ihtiyacımız yok
  })
  it('Public Home renders (Step 3): hero + CTAs', async () => {
    renderAppAt('/')
    // Hero başlığı ve CTA'lar İngilizce
    expect(
      await screen.findByRole('heading', {
        name: /operate smarter with observai/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /request a demo/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
  it('Auth guard works (Step 1): /dashboard without token -> /login', async () => {
    renderAppAt('/dashboard')
    // Login başlığı/CTA İngilizce görünmeli
    expect(
      await screen.findByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
    // Email ve Password input'ları var
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
  it('Login flow + redirect + StoreSelect (Step 1) ', async () => {
    renderAppAt('/login')
    const email = screen.getByLabelText(/email/i)
    const pass = screen.getByLabelText(/password/i)
    await userEvent.type(email, 'demo@obs.ai')
    await userEvent.type(pass, 'password{enter}') // Enter ile submit
    // Başarılı giriş sonrası Dashboard yüklenmeli
    expect(
      await screen.findByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument()
    // Topbar'daki store seçici seçenekleri içermeli
    const storeCombobox = screen.getByRole('combobox', { name: /store/i })
    await userEvent.click(storeCombobox)
    const list = within(screen.getByRole('listbox'))
    expect(list.getByText(/central store/i)).toBeInTheDocument()
    expect(list.getByText(/high street/i)).toBeInTheDocument()
  })
  it('Dashboard metrics render in English (Step 2): revenue/orders/AOV and chart', async () => {
    renderAppAt('/dashboard')
    // KPI label'ları (esnek eşleme)
    expect(await screen.findByText(/revenue/i)).toBeInTheDocument()
    expect(screen.getByText(/orders/i)).toBeInTheDocument()
    expect(screen.getByText(/average order value|aov/i)).toBeInTheDocument()
    // Sales chart alanında bir svg veya canvas bekleriz (Recharts svg üretir)
    const charts = await screen
      .findAllByRole('img', { hidden: true })
      .catch(() => [])
    // alternatif: bir svg presence
    const anySvg = document.querySelector('svg')
    expect(charts.length > 0 || !!anySvg).toBeTruthy()
  })
  it('Sidebar uses brand style & English labels (Step 3 Shell)', async () => {
    renderAppAt('/dashboard')
    // Menü maddeleri
    expect(
      await screen.findByRole('link', { name: /dashboard/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /inventory/i })).toBeInTheDocument()
    // Sidebar bg-ink class'ı kontrolü (data-testid ile spesifik seçim)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('bg-ink')
  })
})
