/**
 * PixiJS Overlay Renderer
 * High-performance canvas overlay for video with track boxes, leader lines, and HUD
 */
import * as PIXI from 'pixi.js'
import { theme, formatDwellTime } from '../config/theme'
export class PixiOverlayRenderer {
  app
  container
  trackLayer
  hudLayer
  trackGraphics = new Map()
  trackTexts = new Map()
  leaderLines = new Map()
  constructor(config) {
    this.container = config.container
    // Initialize PixiJS application
    this.app = new PIXI.Application({
      width: config.width,
      height: config.height,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    })
    this.container.appendChild(this.app.view)
    // Create layers
    this.trackLayer = new PIXI.Container()
    this.hudLayer = new PIXI.Container()
    this.app.stage.addChild(this.trackLayer)
    this.app.stage.addChild(this.hudLayer)
    // Start render loop
    this.app.ticker.add(() => this.render())
  }
  /**
   * Update tracks on the overlay
   */
  updateTracks(tracks) {
    const activeIds = new Set(tracks.map((t) => t.id))
    // Remove old tracks
    this.trackGraphics.forEach((_, id) => {
      if (!activeIds.has(id)) {
        this.removeTrack(id)
      }
    })
    // Update or create tracks
    tracks.forEach((track) => {
      this.updateTrack(track)
    })
  }
  /**
   * Update or create a single track
   */
  updateTrack(track) {
    let graphics = this.trackGraphics.get(track.id)
    let text = this.trackTexts.get(track.id)
    if (!graphics) {
      graphics = new PIXI.Graphics()
      text = new PIXI.Text('', {
        fontFamily: theme.typography.fontFamily.sans,
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: '600',
      })
      this.trackLayer.addChild(graphics)
      this.trackLayer.addChild(text)
      this.trackGraphics.set(track.id, graphics)
      this.trackTexts.set(track.id, text)
    }
    // Convert normalized bbox to screen coordinates
    const [x, y, w, h] = track.bbox
    const screenX = x * this.app.screen.width
    const screenY = y * this.app.screen.height
    const screenW = w * this.app.screen.width
    const screenH = h * this.app.screen.height
    // Determine color based on state
    let color = 0x4fc3f7 // Default blue
    if (track.state === 'entering')
      color = 0xd4fb54 // Lime
    else if (track.state === 'exiting')
      color = 0xff5252 // Red
    else if (track.dwellSec > 600) color = 0xff5252 // Critical - long dwell
    // Draw rounded corner box
    graphics.clear()
    graphics.lineStyle(3, color, 1)
    const cornerLength = 20
    // Top-left
    graphics.moveTo(screenX, screenY + cornerLength)
    graphics.lineTo(screenX, screenY)
    graphics.lineTo(screenX + cornerLength, screenY)
    // Top-right
    graphics.moveTo(screenX + screenW - cornerLength, screenY)
    graphics.lineTo(screenX + screenW, screenY)
    graphics.lineTo(screenX + screenW, screenY + cornerLength)
    // Bottom-right
    graphics.moveTo(screenX + screenW, screenY + screenH - cornerLength)
    graphics.lineTo(screenX + screenW, screenY + screenH)
    graphics.lineTo(screenX + screenW - cornerLength, screenY + screenH)
    // Bottom-left
    graphics.moveTo(screenX + cornerLength, screenY + screenH)
    graphics.lineTo(screenX, screenY + screenH)
    graphics.lineTo(screenX, screenY + screenH - cornerLength)
    // Draw label background
    const labelPadding = 8
    const labelHeight = 24
    graphics.beginFill(0x1e1e28, 0.85)
    graphics.drawRoundedRect(
      screenX,
      screenY - labelHeight - 5,
      screenW,
      labelHeight,
      6
    )
    graphics.endFill()
    // Update text label
    if (text) {
      const parts = [`ID:${track.id.slice(-4)}`]
      if (track.gender) {
        const genderIcon =
          track.gender === 'male'
            ? '♂'
            : track.gender === 'female'
              ? '♀'
              : '?'
        parts.push(genderIcon)
      }
      if (track.ageBucket) {
        parts.push(track.ageBucket)
      }
      parts.push(formatDwellTime(track.dwellSec))
      if (track.dwellSec > 600) {
        parts.push('⚠')
      }
      text.text = parts.join(' | ')
      text.x = screenX + labelPadding
      text.y = screenY - labelHeight + 2
      text.style.fill = color
    }
    // Draw leader line if needed (for collision avoidance)
    // TODO: Implement collision detection and leader lines
  }
  /**
   * Remove a track from the overlay
   */
  removeTrack(id) {
    const graphics = this.trackGraphics.get(id)
    const text = this.trackTexts.get(id)
    const line = this.leaderLines.get(id)
    if (graphics) {
      this.trackLayer.removeChild(graphics)
      graphics.destroy()
      this.trackGraphics.delete(id)
    }
    if (text) {
      this.trackLayer.removeChild(text)
      text.destroy()
      this.trackTexts.delete(id)
    }
    if (line) {
      this.trackLayer.removeChild(line)
      line.destroy()
      this.leaderLines.delete(id)
    }
  }
  /**
   * Render loop
   */
  render() {
    // Additional per-frame logic can go here
  }
  /**
   * Resize overlay
   */
  resize(width, height) {
    this.app.renderer.resize(width, height)
  }
  /**
   * Cleanup
   */
  destroy() {
    this.trackGraphics.forEach((g) => g.destroy())
    this.trackTexts.forEach((t) => t.destroy())
    this.leaderLines.forEach((l) => l.destroy())
    this.app.destroy(true, { children: true, texture: true, baseTexture: true })
  }
}
