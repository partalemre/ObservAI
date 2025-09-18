import React from 'react'
import { cn } from '../../lib/utils'

interface GradientBGProps {
  children: React.ReactNode
  className?: string
  showGrid?: boolean
}

export const GradientBG: React.FC<GradientBGProps> = ({
  children,
  className,
  showGrid = true,
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Radial gradient background */}
      <div
        className="bg-gradient-radial from-brand/20 absolute inset-0 via-transparent to-transparent"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 40%, rgba(54, 124, 150, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Secondary gradient */}
      <div
        className="bg-gradient-radial from-accent/10 absolute inset-0 via-transparent to-transparent"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 60%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Grid pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(54, 124, 150, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(54, 124, 150, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
