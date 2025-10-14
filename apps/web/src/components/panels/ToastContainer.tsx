/**
 * ToastContainer - Event toast notifications
 * Top-right positioned toast system with auto-dismiss
 */

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'
import type { ToastEvent } from '../../types/streams'

export const ToastContainer: React.FC = () => {
  const toasts = useAnalyticsStore((state) => state.toasts)
  const removeToast = useAnalyticsStore((state) => state.removeToast)

  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-3"
      style={{ maxWidth: '400px' }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: ToastEvent
  onDismiss: () => void
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const toastRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get toast colors based on type
  const colors = getToastColors(toast.type)

  // Mount animation
  useEffect(() => {
    if (!toastRef.current) return

    // Slide in from right with fade
    gsap.fromTo(
      toastRef.current,
      {
        x: 100,
        opacity: 0,
        scale: 0.96,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
      }
    )

    // Auto-dismiss after duration (default 3s)
    const duration = toast.duration || 3000
    timeoutRef.current = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleDismiss = () => {
    if (!toastRef.current) return

    // Fade out animation
    gsap.to(toastRef.current, {
      x: 100,
      opacity: 0,
      scale: 0.96,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        onDismiss()
      },
    })
  }

  return (
    <GlassCard
      ref={toastRef}
      className="pointer-events-auto cursor-pointer"
      border={true}
      onClick={handleDismiss}
      style={{
        borderLeft: `4px solid ${colors.accent}`,
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
          style={{
            background: colors.accent,
            color: '#ffffff',
          }}
        >
          {getToastIcon(toast.type)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4
            className="mb-1 text-sm font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            {toast.title}
          </h4>
          <p
            className="text-xs leading-relaxed"
            style={{ color: theme.colors.text.secondary }}
          >
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: theme.colors.text.secondary,
          }}
        >
          ×
        </button>
      </div>
    </GlassCard>
  )
}

// Helper functions
function getToastColors(type: ToastEvent['type']): {
  accent: string
  background: string
} {
  const colorMap = {
    info: {
      accent: theme.colors.accent.blue,
      background: 'rgba(79, 195, 247, 0.1)',
    },
    warning: {
      accent: theme.colors.accent.orange,
      background: 'rgba(255, 183, 77, 0.1)',
    },
    error: {
      accent: theme.colors.accent.red,
      background: 'rgba(255, 82, 82, 0.1)',
    },
    success: {
      accent: theme.colors.accent.lime,
      background: 'rgba(212, 251, 84, 0.1)',
    },
  }

  return colorMap[type]
}

function getToastIcon(type: ToastEvent['type']): string {
  const iconMap = {
    info: 'i',
    warning: '!',
    error: '✕',
    success: '✓',
  }

  return iconMap[type]
}
