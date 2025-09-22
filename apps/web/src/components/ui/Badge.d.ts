import React from 'react'
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}
export declare const Badge: React.FC<BadgeProps>
export {}
