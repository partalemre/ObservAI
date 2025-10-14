/**
 * GlassCard - Glassmorphism card component
 * Kibsi-inspired glass aesthetics with backdrop blur
 */

import React from 'react'
import { cn } from '../../lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
  border?: boolean
  glow?: boolean
  onClick?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  gradient = false,
  border = true,
  glow = false,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl backdrop-blur-[22px] transition-all duration-300',
        'bg-[rgba(20,20,28,0.35)]',
        border && 'border border-white/12',
        gradient && 'bg-gradient-to-br from-purple-500/10 to-blue-500/10',
        glow && 'shadow-[0_0_24px_rgba(124,77,255,0.35)]',
        onClick && 'cursor-pointer hover:scale-[1.02] hover:border-white/18',
        className
      )}
      onClick={onClick}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
