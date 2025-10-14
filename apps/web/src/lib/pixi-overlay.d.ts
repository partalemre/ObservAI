/**
 * PixiJS Overlay Renderer
 * High-performance canvas overlay for video with track boxes, leader lines, and HUD
 */
import type { TrackStream } from '../types/streams'
export interface PixiOverlayConfig {
  container: HTMLElement
  width: number
  height: number
  videoElement?: HTMLVideoElement
}
export declare class PixiOverlayRenderer {
  private app
  private container
  private trackLayer
  private hudLayer
  private trackGraphics
  private trackTexts
  private leaderLines
  constructor(config: PixiOverlayConfig)
  /**
   * Update tracks on the overlay
   */
  updateTracks(tracks: TrackStream[]): void
  /**
   * Update or create a single track
   */
  private updateTrack
  /**
   * Remove a track from the overlay
   */
  private removeTrack
  /**
   * Render loop
   */
  private render
  /**
   * Resize overlay
   */
  resize(width: number, height: number): void
  /**
   * Cleanup
   */
  destroy(): void
}
