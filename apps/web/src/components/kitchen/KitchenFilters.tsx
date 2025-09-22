import React from 'react'
import { Search, Volume2, VolumeX, Grid3X3, List } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '../../lib/utils'
import { useKitchenStore } from '../../store/kitchenStore'
import { t } from '../../lib/i18n'

interface KitchenFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
}

export const KitchenFilters: React.FC<KitchenFiltersProps> = ({
  searchQuery,
  onSearchChange,
  className,
}) => {
  const { density, sound, filter, setDensity, setSound, setFilter } =
    useKitchenStore()

  const channels = [
    { value: 'ALL', label: t('kitchen.filters.all') },
    { value: 'DINE_IN', label: t('kitchen.filters.dinein') },
    { value: 'TAKEAWAY', label: t('kitchen.filters.takeaway') },
    { value: 'DELIVERY', label: t('kitchen.filters.delivery') },
  ] as const

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-gray-200 bg-white p-4',
        className
      )}
    >
      {/* Top Row: Search and Channel Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder={t('kitchen.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap text-gray-700">
            {t('kitchen.filters.channel')}:
          </span>
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {channels.map((channel) => (
              <button
                key={channel.value}
                onClick={() => setFilter({ channel: channel.value })}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  filter.channel === channel.value
                    ? 'text-brand bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {channel.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Density and Sound Controls */}
      <div className="flex items-center justify-between">
        {/* Density Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {t('kitchen.filters.density')}:
          </span>
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setDensity('comfortable')}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                density === 'comfortable'
                  ? 'text-brand bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <List className="h-4 w-4" />
              {t('kitchen.filters.comfortable')}
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                density === 'compact'
                  ? 'text-brand bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
              {t('kitchen.filters.compact')}
            </button>
          </div>
        </div>

        {/* Sound Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSound(!sound)}
          className={cn(
            'flex items-center gap-2',
            sound ? 'text-brand' : 'text-gray-500'
          )}
        >
          {sound ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{t('kitchen.filters.sound')}</span>
        </Button>
      </div>
    </div>
  )
}
