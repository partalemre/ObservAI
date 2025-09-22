import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Search, Volume2, VolumeX, Grid3X3, List } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
import { useKitchenStore } from '../../store/kitchenStore'
import { t } from '../../lib/i18n'
export const KitchenFilters = ({ searchQuery, onSearchChange, className }) => {
  const { density, sound, filter, setDensity, setSound, setFilter } =
    useKitchenStore()
  const channels = [
    { value: 'ALL', label: t('kitchen.filters.all') },
    { value: 'DINE_IN', label: t('kitchen.filters.dinein') },
    { value: 'TAKEAWAY', label: t('kitchen.filters.takeaway') },
    { value: 'DELIVERY', label: t('kitchen.filters.delivery') },
  ]
  return _jsxs('div', {
    className: cn(
      'flex flex-col gap-4 border-b border-gray-200 bg-white p-4',
      className
    ),
    children: [
      _jsxs('div', {
        className: 'flex flex-col gap-4 sm:flex-row',
        children: [
          _jsxs('div', {
            className: 'relative flex-1',
            children: [
              _jsx(Search, {
                className:
                  'absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400',
              }),
              _jsx(Input, {
                type: 'text',
                placeholder: t('kitchen.searchPlaceholder'),
                value: searchQuery,
                onChange: (e) => onSearchChange(e.target.value),
                className: 'pl-10',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsxs('span', {
                className:
                  'text-sm font-medium whitespace-nowrap text-gray-700',
                children: [t('kitchen.filters.channel'), ':'],
              }),
              _jsx('div', {
                className:
                  'flex rounded-lg border border-gray-200 bg-gray-50 p-1',
                children: channels.map((channel) =>
                  _jsx(
                    'button',
                    {
                      onClick: () => setFilter({ channel: channel.value }),
                      className: cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                        filter.channel === channel.value
                          ? 'text-brand bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      ),
                      children: channel.label,
                    },
                    channel.value
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsxs('span', {
                className: 'text-sm font-medium text-gray-700',
                children: [t('kitchen.filters.density'), ':'],
              }),
              _jsxs('div', {
                className:
                  'flex rounded-lg border border-gray-200 bg-gray-50 p-1',
                children: [
                  _jsxs('button', {
                    onClick: () => setDensity('comfortable'),
                    className: cn(
                      'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      density === 'comfortable'
                        ? 'text-brand bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ),
                    children: [
                      _jsx(List, { className: 'h-4 w-4' }),
                      t('kitchen.filters.comfortable'),
                    ],
                  }),
                  _jsxs('button', {
                    onClick: () => setDensity('compact'),
                    className: cn(
                      'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      density === 'compact'
                        ? 'text-brand bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ),
                    children: [
                      _jsx(Grid3X3, { className: 'h-4 w-4' }),
                      t('kitchen.filters.compact'),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsxs(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: () => setSound(!sound),
            className: cn(
              'flex items-center gap-2',
              sound ? 'text-brand' : 'text-gray-500'
            ),
            children: [
              sound
                ? _jsx(Volume2, { className: 'h-4 w-4' })
                : _jsx(VolumeX, { className: 'h-4 w-4' }),
              _jsx('span', {
                className: 'hidden sm:inline',
                children: t('kitchen.filters.sound'),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
