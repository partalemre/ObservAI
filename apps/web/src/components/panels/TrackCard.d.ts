/**
 * TrackCard - Micro glass card for individual tracks
 * Shows track info with position anchoring
 */
import React from 'react'
import type { TrackStream } from '../../types/streams'
interface TrackCardProps {
  track: TrackStream
  position?: {
    x: number
    y: number
  }
  className?: string
}
export declare const TrackCard: React.FC<TrackCardProps>
export {}
