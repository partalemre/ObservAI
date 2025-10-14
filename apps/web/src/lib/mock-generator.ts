/**
 * Mock Data Generator
 * Generates realistic demo data when WebSocket is unavailable
 */

import type {
  GlobalStream,
  TrackStream,
  HeatPoint,
  TrackState,
} from '../types/streams'

export class MockDataGenerator {
  private interval: NodeJS.Timeout | null = null
  private trackIdCounter = 1000
  private activeTracks: Map<string, TrackStream> = new Map()
  private cumulativeEntries = 0
  private cumulativeExits = 0
  private heatmapGrid: number[][] = []

  constructor(
    private onGlobalUpdate: (data: GlobalStream) => void,
    private onTracksUpdate: (data: TrackStream[]) => void,
    private updateInterval = 1000 // 1 second
  ) {
    // Initialize heatmap grid
    this.heatmapGrid = Array.from({ length: 20 }, () => Array(20).fill(0))
  }

  start(): void {
    if (this.interval) {
      return
    }

    console.log('[MockGenerator] Starting demo mode')

    // Initial state
    this.generateInitialTracks()

    this.interval = setInterval(() => {
      this.tick()
    }, this.updateInterval)
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.activeTracks.clear()
    console.log('[MockGenerator] Stopped')
  }

  private tick(): void {
    // Simulate track lifecycle: entering → present → exiting
    this.updateTracks()

    // Occasionally add new tracks
    if (Math.random() > 0.7 && this.activeTracks.size < 15) {
      this.createNewTrack()
    }

    // Update heatmap
    this.updateHeatmap()

    // Build and emit GlobalStream
    const global = this.buildGlobalStream()
    this.onGlobalUpdate(global)

    // Emit tracks
    const tracks = Array.from(this.activeTracks.values())
    this.onTracksUpdate(tracks)
  }

  private generateInitialTracks(): void {
    const count = Math.floor(Math.random() * 5) + 3 // 3-7 initial tracks
    for (let i = 0; i < count; i++) {
      this.createNewTrack()
    }
  }

  private createNewTrack(): void {
    const id = `track_${this.trackIdCounter++}`
    const x = Math.random() * 0.8 + 0.1 // 0.1 to 0.9
    const y = Math.random() * 0.8 + 0.1
    const w = 0.05 + Math.random() * 0.05 // 5-10%
    const h = 0.08 + Math.random() * 0.08 // 8-16%

    const genders: Array<'male' | 'female' | 'unknown'> = [
      'male',
      'female',
      'unknown',
    ]
    const ages: Array<'child' | 'young' | 'adult' | 'mature' | 'senior'> = [
      'child',
      'young',
      'adult',
      'mature',
      'senior',
    ]

    const track: TrackStream = {
      id,
      bbox: [x, y, w, h],
      gender: genders[Math.floor(Math.random() * genders.length)],
      ageBucket: ages[Math.floor(Math.random() * ages.length)],
      dwellSec: 0,
      state: 'entering',
    }

    this.activeTracks.set(id, track)
    this.cumulativeEntries++
  }

  private updateTracks(): void {
    const tracksToRemove: string[] = []

    this.activeTracks.forEach((track, id) => {
      // Increment dwell time
      track.dwellSec += this.updateInterval / 1000

      // Update state based on dwell time
      if (track.state === 'entering' && track.dwellSec > 2) {
        track.state = 'present'
      } else if (
        track.state === 'present' &&
        track.dwellSec > 15 &&
        Math.random() > 0.95
      ) {
        track.state = 'exiting'
      } else if (track.state === 'exiting' && track.dwellSec > 18) {
        track.state = 'lost'
        tracksToRemove.push(id)
        this.cumulativeExits++
      }

      // Slight random movement for present tracks
      if (track.state === 'present') {
        const [x, y, w, h] = track.bbox
        const newX = Math.max(
          0.05,
          Math.min(0.95, x + (Math.random() - 0.5) * 0.02)
        )
        const newY = Math.max(
          0.05,
          Math.min(0.95, y + (Math.random() - 0.5) * 0.02)
        )
        track.bbox = [newX, newY, w, h]
      }
    })

    // Remove lost tracks
    tracksToRemove.forEach((id) => this.activeTracks.delete(id))
  }

  private updateHeatmap(): void {
    // Add current track positions to heatmap
    this.activeTracks.forEach((track) => {
      if (track.state === 'present') {
        const [x, y] = track.bbox
        const gridX = Math.floor(x * 20)
        const gridY = Math.floor(y * 20)
        if (gridX >= 0 && gridX < 20 && gridY >= 0 && gridY < 20) {
          this.heatmapGrid[gridY][gridX] += 1
        }
      }
    })

    // Decay heatmap over time
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        this.heatmapGrid[r][c] *= 0.98
      }
    }
  }

  private buildGlobalStream(): GlobalStream {
    const presentTracks = Array.from(this.activeTracks.values()).filter(
      (t) => t.state === 'present' || t.state === 'entering'
    )
    const queueTracks = presentTracks.filter((t) => {
      const [x] = t.bbox
      return x < 0.3 // Mock queue zone on left side
    })

    // Count demographics
    const genderCounts = { male: 0, female: 0, unknown: 0 }
    const ageCounts = { child: 0, young: 0, adult: 0, mature: 0, senior: 0 }

    presentTracks.forEach((track) => {
      if (track.gender) {
        genderCounts[track.gender]++
      }
      if (track.ageBucket) {
        ageCounts[track.ageBucket]++
      }
    })

    // Build heatmap points
    const heatPoints: HeatPoint[] = []
    const maxValue = Math.max(...this.heatmapGrid.flat(), 1)

    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        const value = this.heatmapGrid[r][c]
        if (value > 0.5) {
          heatPoints.push({
            x: c / 20,
            y: r / 20,
            intensity: Math.min(value / maxValue, 1),
          })
        }
      }
    }

    return {
      timestamp: Date.now(),
      entries: this.cumulativeEntries,
      exits: this.cumulativeExits,
      current: presentTracks.length,
      queue: queueTracks.length,
      demographics: {
        gender: genderCounts,
        ages: ageCounts,
      },
      heatmap: {
        points: heatPoints,
        gridWidth: 20,
        gridHeight: 20,
      },
    }
  }
}
