import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
export const AppShell = () => {
  return _jsxs('div', {
    className: 'flex h-screen bg-gray-100',
    children: [
      _jsx(Sidebar, {}),
      _jsxs('div', {
        className: 'flex flex-1 flex-col overflow-hidden',
        children: [
          _jsx(Topbar, {}),
          _jsx('main', {
            className: 'flex-1 overflow-auto',
            children: _jsx(Outlet, {}),
          }),
        ],
      }),
    ],
  })
}
