/**
 * TrackCard - Micro glass card for individual tracks
 * Shows track info with position anchoring
 */

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { GlassCard } from '../ui/GlassCard'
import { theme, formatDwellTime, genderColor } from '../../config/theme'
import type { TrackStream } from '../../types/streams'

interface TrackCardProps {
  track: TrackStream
  position?: {
    x: number
    y: number
  }
  className?: string
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  position,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

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

  return (
    <GlassCard
      ref={cardRef}
      className={`relative ${className}`}
      border={true}
      glow={isHighDwell}
      style={{
        position: position ? 'absolute' : 'relative',
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        minWidth: '180px',
      }}
    >
      <div className="space-y-2 p-3">
        {/* Header: ID and Gender */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              ID: {track.id}
            </span>
            {/* High dwell badge */}
            {isHighDwell && (
              <div
                ref={badgeRef}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                style={{
                  background: theme.colors.accent.red,
                  color: '#ffffff',
                }}
              >
                HIGH
              </div>
            )}
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: genderColorValue }}
          >
            {genderIcon}
          </span>
        </div>

        {/* Age Bucket */}
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: theme.colors.text.secondary }}>Age Group:</span>
          <span
            className="font-medium capitalize"
            style={{ color: theme.colors.text.primary }}
          >
            {track.ageBucket || 'Unknown'}
          </span>
        </div>

        {/* Dwell Time */}
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: theme.colors.text.secondary }}>
            Dwell Time:
          </span>
          <span
            className="font-mono font-semibold"
            style={{
              color: isHighDwell
                ? theme.colors.accent.red
                : theme.colors.text.primary,
            }}
          >
            {formatDwellTime(track.dwellSec)}
          </span>
        </div>

        {/* State */}
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: theme.colors.text.secondary }}>State:</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
            style={{
              background: getStateColor(track.state),
              color: '#ffffff',
            }}
          >
            {track.state}
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

// Helper function for state colors
function getStateColor(state: string): string {
  const colors = {
    entering: theme.colors.accent.lime,
    present: theme.colors.accent.blue,
    exiting: theme.colors.accent.orange,
    lost: theme.colors.accent.red,
  }
  return colors[state as keyof typeof colors] || theme.colors.text.dim
}
