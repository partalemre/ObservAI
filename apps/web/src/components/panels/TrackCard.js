import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime'
/**
 * TrackCard - Micro glass card for individual tracks
 * Shows track info with position anchoring
 */
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { theme, formatDwellTime, genderColor } from '../../config/theme'
export const TrackCard = ({ track, position, className = '' }) => {
  const cardRef = useRef(null)
  const badgeRef = useRef(null)
  // Get dwell time warning threshold
  const isHighDwell = track.dwellSec > 600
  // Gender icon
  const genderIcon =
    track.gender === 'male' ? '♂' : track.gender === 'female' ? '♀' : '?'
  const genderColorValue = genderColor(track.gender || 'unknown')
  // Mount animation
  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      {
        scale: 0.96,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      }
    )
  }, [])
  // Pulse animation for high dwell time
  useEffect(() => {
    if (!badgeRef.current || !isHighDwell) return
    const timeline = gsap.timeline({ repeat: -1 })
    timeline
      .to(badgeRef.current, {
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.inOut',
      })
      .to(badgeRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    return () => {
      timeline.kill()
    }
  }, [isHighDwell])
  return _jsx(GlassCard, {
    ref: cardRef,
    className: `relative ${className}`,
    border: true,
    glow: isHighDwell,
    style: {
      position: position ? 'absolute' : 'relative',
      left: position ? `${position.x}px` : undefined,
      top: position ? `${position.y}px` : undefined,
      minWidth: '180px',
    },
    children: _jsxs('div', {
      className: 'p-3 space-y-2',
      children: [
        _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            _jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                _jsxs('span', {
                  className: 'text-xs font-mono font-semibold',
                  style: { color: theme.colors.text.primary },
                  children: ['ID: ', track.id],
                }),
                isHighDwell &&
                  _jsx('div', {
                    ref: badgeRef,
                    className: 'px-1.5 py-0.5 rounded text-[10px] font-bold',
                    style: {
                      background: theme.colors.accent.red,
                      color: '#ffffff',
                    },
                    children: 'HIGH',
                  }),
              ],
            }),
            _jsx('span', {
              className: 'text-lg font-bold',
              style: { color: genderColorValue },
              children: genderIcon,
            }),
          ],
        }),
        _jsxs('div', {
          className: 'flex items-center justify-between text-xs',
          children: [
            _jsx('span', {
              style: { color: theme.colors.text.secondary },
              children: 'Age Group:',
            }),
            _jsx('span', {
              className: 'font-medium capitalize',
              style: { color: theme.colors.text.primary },
              children: track.ageBucket || 'Unknown',
            }),
          ],
        }),
        _jsxs('div', {
          className: 'flex items-center justify-between text-xs',
          children: [
            _jsx('span', {
              style: { color: theme.colors.text.secondary },
              children: 'Dwell Time:',
            }),
            _jsx('span', {
              className: 'font-mono font-semibold',
              style: {
                color: isHighDwell
                  ? theme.colors.accent.red
                  : theme.colors.text.primary,
              },
              children: formatDwellTime(track.dwellSec),
            }),
          ],
        }),
        _jsxs('div', {
          className: 'flex items-center justify-between text-xs',
          children: [
            _jsx('span', {
              style: { color: theme.colors.text.secondary },
              children: 'State:',
            }),
            _jsx('span', {
              className:
                'px-2 py-0.5 rounded-full text-[10px] font-medium capitalize',
              style: {
                background: getStateColor(track.state),
                color: '#ffffff',
              },
              children: track.state,
            }),
          ],
        }),
      ],
    }),
  })
}
// Helper function for state colors
function getStateColor(state) {
  const colors = {
    entering: theme.colors.accent.lime,
    present: theme.colors.accent.blue,
    exiting: theme.colors.accent.orange,
    lost: theme.colors.accent.red,
  }
  return colors[state] || theme.colors.text.dim
}
