import React from 'react'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import { Button } from './ui'
import { StoreSelect } from './StoreSelect'
import { t } from '../lib/i18n'
import { Menu } from 'lucide-react'

export const Topbar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="border-border border-b bg-white/70 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-ink/60 hover:text-ink hover:bg-ink/5 rounded-xl p-2 transition-colors lg:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <StoreSelect />

          <div className="flex items-center space-x-3">
            <div className="hidden text-sm sm:block">
              <p className="text-ink font-medium">{user?.name || 'User'}</p>
              <p className="text-ink/60 text-xs">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="bg-brand/10 ring-brand/20 flex h-10 w-10 items-center justify-center rounded-full ring-2">
              <span className="text-brand text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
