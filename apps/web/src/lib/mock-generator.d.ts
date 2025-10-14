/**
 * Mock Data Generator
 * Generates realistic demo data when WebSocket is unavailable
 */
import type { GlobalStream, TrackStream } from '../types/streams'
export declare class MockDataGenerator {
  private onGlobalUpdate
  private onTracksUpdate
  private updateInterval
  private interval
  private trackIdCounter
  private activeTracks
  private cumulativeEntries
  private cumulativeExits
  private heatmapGrid
  constructor(
    onGlobalUpdate: (data: GlobalStream) => void,
    onTracksUpdate: (data: TrackStream[]) => void,
    updateInterval?: number
  )
  start(): void
  stop(): void
  private tick
  private generateInitialTracks
  private createNewTrack
  private updateTracks
  private updateHeatmap
  private buildGlobalStream
}
