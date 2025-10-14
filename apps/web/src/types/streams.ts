/**
 * Core data contracts for ObservAI real-time analytics
 * Used by both overlay and dashboard components
 */

export type GenderKey = 'male' | 'female' | 'unknown'
export type AgeBucket = 'child' | 'young' | 'adult' | 'mature' | 'senior'

export interface GenderBreakdown {
  male: number
  female: number
  unknown: number
}

export interface AgeBuckets {
  child: number // 0-17
  young: number // 18-35
  adult: number // 36-50
  mature: number // 51-70
  senior: number // 70+
}

export interface HeatPoint {
  x: number // normalized 0..1
  y: number // normalized 0..1
  intensity: number // 0..1
}

export interface HeatmapData {
  points: HeatPoint[]
  gridWidth?: number
  gridHeight?: number
}

export interface GlobalStream {
  timestamp: number
  entries: number
  exits: number
  current: number
  queue: number
  demographics: {
    gender: GenderBreakdown
    ages: AgeBuckets
  }
  heatmap: HeatmapData
}

export type TrackState = 'entering' | 'present' | 'exiting' | 'lost'

export interface TrackStream {
  id: string
  bbox: [number, number, number, number] // normalized [x, y, w, h]
  polygon?: Array<{ x: number; y: number }>
  gender?: GenderKey
  ageBucket?: AgeBucket
  dwellSec: number
  state: TrackState
}

export interface TableRegion {
  tableId: string
  polygon: Array<{ x: number; y: number }>
  metrics: {
    occupancy: number
    dwellAvg: number
    turnaroundMin: number
  }
  alerts: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    message: string
  }>
}

export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'retrying'
  | 'demo'

export interface StreamMessage {
  type: 'global' | 'track' | 'table' | 'heartbeat'
  data: GlobalStream | TrackStream | TableRegion | null
}

export interface ToastEvent {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: number
  duration?: number
}

export interface DemographicDelta {
  genderChange: number
  ageChange: number
  trend: 'up' | 'down' | 'stable'
}

export interface HistogramBin {
  min: number
  max: number
  count: number
}

export interface RollingWindow {
  duration: 30 | 60 | 120 // minutes
  label: string
}

export interface PerformanceMetrics {
  fps: number
  droppedFrames: number
  latency: number
  memoryUsage?: number
}
