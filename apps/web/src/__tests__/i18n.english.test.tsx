import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { t, getLang } from '../lib/i18n'
import { Sidebar } from '../components/Sidebar'

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

describe('i18n English', () => {
  test('t function returns correct English translations', () => {
    expect(t('nav.dashboard')).toBe('Dashboard')
    expect(t('nav.pos')).toBe('POS')
    expect(t('nav.menu')).toBe('Menu')
    expect(t('common.appName')).toBe('ObservAI')
    expect(t('auth.signIn')).toBe('Sign In')
  })

  test('default language is English', () => {
    expect(getLang()).toBe('en')
  })

  test('Sidebar renders with English labels', () => {
    const Wrapper = createWrapper()
    render(<Sidebar />, { wrapper: Wrapper })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('POS')).toBeInTheDocument()
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Inventory')).toBeInTheDocument()
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('ObservAI')).toBeInTheDocument()
  })

  test('returns path when translation not found', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key')
  })
})
