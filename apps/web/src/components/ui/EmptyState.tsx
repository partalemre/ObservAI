import React from 'react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('px-4 py-12 text-center', className)}>
      {icon && (
        <div className="mx-auto mb-4 h-12 w-12 text-gray-400">{icon}</div>
      )}
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mx-auto mb-6 max-w-sm text-gray-500">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
