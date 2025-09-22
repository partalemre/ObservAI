import { jsx as _jsx } from 'react/jsx-runtime'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { cn } from '../../lib/utils'
import { t } from '../../lib/i18n'
export const DateRangePicker = ({ onRangeChange, className }) => {
  const [activePreset, setActivePreset] = useState('today')
  const presets = [
    {
      key: 'today',
      label: t('dashboard.rangeToday'),
      getRange: () => ({
        from: dayjs().startOf('day').toISOString(),
        to: dayjs().endOf('day').toISOString(),
      }),
    },
    {
      key: '7days',
      label: t('dashboard.range7'),
      getRange: () => ({
        from: dayjs().subtract(6, 'day').startOf('day').toISOString(),
        to: dayjs().endOf('day').toISOString(),
      }),
    },
    {
      key: '30days',
      label: t('dashboard.range30'),
      getRange: () => ({
        from: dayjs().subtract(29, 'day').startOf('day').toISOString(),
        to: dayjs().endOf('day').toISOString(),
      }),
    },
  ]
  const handlePresetClick = (preset) => {
    setActivePreset(preset)
    const selectedPreset = presets.find((p) => p.key === preset)
    if (selectedPreset) {
      onRangeChange(selectedPreset.getRange())
    }
  }
  // Initialize with today's range
  React.useEffect(() => {
    const todayRange = presets[0].getRange()
    onRangeChange(todayRange)
  }, [onRangeChange])
  return _jsx('div', {
    className: cn('flex space-x-2', className),
    children: presets.map((preset) =>
      _jsx(
        'button',
        {
          onClick: () => handlePresetClick(preset.key),
          className: cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            activePreset === preset.key
              ? 'border border-blue-200 bg-blue-100 text-blue-700'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          ),
          children: preset.label,
        },
        preset.key
      )
    ),
  })
}
