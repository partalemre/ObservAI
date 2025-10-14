import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
/**
 * ToastContainer - Event toast notifications
 * Top-right positioned toast system with auto-dismiss
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { theme } from '../../config/theme'
export const ToastContainer = () => {
  const toasts = useAnalyticsStore((state) => state.toasts)
  const removeToast = useAnalyticsStore((state) => state.removeToast)
  return _jsx('div', {
    className:
      'fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none',
    style: { maxWidth: '400px' },
    children: toasts.map((toast) =>
      _jsx(
        Toast,
        { toast: toast, onDismiss: () => removeToast(toast.id) },
        toast.id
      )
    ),
  })
}
const Toast = ({ toast, onDismiss }) => {
  const toastRef = useRef(null)
  const timeoutRef = useRef(null)
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
  return _jsx(GlassCard, {
    ref: toastRef,
    className: 'pointer-events-auto cursor-pointer',
    border: true,
    onClick: handleDismiss,
    style: {
      borderLeft: `4px solid ${colors.accent}`,
    },
    children: _jsxs('div', {
      className: 'p-4 flex items-start gap-3',
      children: [
        _jsx('div', {
          className:
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold',
          style: {
            background: colors.accent,
            color: '#ffffff',
          },
          children: getToastIcon(toast.type),
        }),
        _jsxs('div', {
          className: 'flex-1 min-w-0',
          children: [
            _jsx('h4', {
              className: 'text-sm font-semibold mb-1',
              style: { color: theme.colors.text.primary },
              children: toast.title,
            }),
            _jsx('p', {
              className: 'text-xs leading-relaxed',
              style: { color: theme.colors.text.secondary },
              children: toast.message,
            }),
          ],
        }),
        _jsx('button', {
          onClick: handleDismiss,
          className:
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110',
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: theme.colors.text.secondary,
          },
          children: '\u00D7',
        }),
      ],
    }),
  })
}
// Helper functions
function getToastColors(type) {
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
function getToastIcon(type) {
  const iconMap = {
    info: 'i',
    warning: '!',
    error: '✕',
    success: '✓',
  }
  return iconMap[type]
}
