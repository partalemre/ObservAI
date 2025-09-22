import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import { Button } from './ui'
import { StoreSelect } from './StoreSelect'
import { Menu } from 'lucide-react'
export const Topbar = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  return _jsx('header', {
    className: 'border-border border-b bg-white/70 backdrop-blur',
    children: _jsxs('div', {
      className: 'flex h-16 items-center justify-between px-4',
      children: [
        _jsx('div', {
          className: 'flex items-center',
          children: _jsxs('button', {
            onClick: () => setSidebarOpen(!sidebarOpen),
            className:
              'text-ink/60 hover:text-ink hover:bg-ink/5 rounded-xl p-2 transition-colors lg:hidden',
            children: [
              _jsx('span', { className: 'sr-only', children: 'Toggle menu' }),
              _jsx(Menu, { className: 'h-5 w-5' }),
            ],
          }),
        }),
        _jsxs('div', {
          className: 'flex items-center space-x-4',
          children: [
            _jsx(StoreSelect, {}),
            _jsxs('div', {
              className: 'flex items-center space-x-3',
              children: [
                _jsxs('div', {
                  className: 'hidden text-sm sm:block',
                  children: [
                    _jsx('p', {
                      className: 'text-ink font-medium',
                      children: user?.name || 'User',
                    }),
                    _jsx('p', {
                      className: 'text-ink/60 text-xs',
                      children: user?.email || 'user@example.com',
                    }),
                  ],
                }),
                _jsx('div', {
                  className:
                    'bg-brand/10 ring-brand/20 flex h-10 w-10 items-center justify-center rounded-full ring-2',
                  children: _jsx('span', {
                    className: 'text-brand text-sm font-semibold',
                    children: user?.name?.charAt(0).toUpperCase() || 'U',
                  }),
                }),
              ],
            }),
            _jsx(Button, {
              variant: 'secondary',
              size: 'sm',
              onClick: logout,
              children: 'Log out',
            }),
          ],
        }),
      ],
    }),
  })
}
