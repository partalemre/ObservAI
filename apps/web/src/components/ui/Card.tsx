import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'border-border rounded-2xl border bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
