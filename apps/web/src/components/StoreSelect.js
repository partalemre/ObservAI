import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { useOrgStore } from '../store/orgStore'
import { cn } from '../lib/utils'
import { t } from '../lib/i18n'
export const StoreSelect = () => {
  const { stores, selectedStoreId, setSelectedStore } = useOrgStore()
  const [isOpen, setIsOpen] = useState(false)
  const selectedStore = stores.find((store) => store.id === selectedStoreId)
  if (!stores.length) {
    return _jsx('div', {
      className: 'text-sm text-gray-500',
      children: t('topbar.store'),
    })
  }
  return _jsxs('div', {
    className: 'relative',
    children: [
      _jsxs('button', {
        onClick: () => setIsOpen(!isOpen),
        className:
          'flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        children: [
          _jsx('span', {
            className: 'text-gray-700',
            children: selectedStore?.name || t('topbar.chooseStore'),
          }),
          _jsx('svg', {
            className: cn(
              'h-4 w-4 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            ),
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            children: _jsx('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M19 9l-7 7-7-7',
            }),
          }),
        ],
      }),
      isOpen &&
        _jsx('div', {
          className:
            'absolute right-0 z-50 mt-1 w-56 rounded-md border border-gray-300 bg-white shadow-lg',
          children: _jsx('div', {
            className: 'py-1',
            children: stores.map((store) =>
              _jsx(
                'button',
                {
                  onClick: () => {
                    setSelectedStore(store.id)
                    setIsOpen(false)
                  },
                  className: cn(
                    'w-full px-4 py-2 text-left text-sm hover:bg-gray-100',
                    selectedStoreId === store.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  ),
                  children: store.name,
                },
                store.id
              )
            ),
          }),
        }),
      isOpen &&
        _jsx('div', {
          className: 'fixed inset-0 z-40',
          onClick: () => setIsOpen(false),
        }),
    ],
  })
}
