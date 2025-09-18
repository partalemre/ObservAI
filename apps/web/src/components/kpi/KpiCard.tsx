import React from 'react'
import { cn } from '../../lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  helper?: string
  className?: string
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  helper,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
        </div>
      </div>
    </div>
  )
}
