/**
 * GlassCard - Glassmorphism card component
 * Kibsi-inspired glass aesthetics with backdrop blur
 */
import React from 'react'
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
  border?: boolean
  glow?: boolean
  onClick?: () => void
}
export declare const GlassCard: React.FC<GlassCardProps>
export {}
