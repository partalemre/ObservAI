/**
 * WebSocket Client with auto-reconnection and exponential backoff
 * Supports both live stream and fallback to mock data
 */

import { io, Socket } from 'socket.io-client'
import type {
  GlobalStream,
  TrackStream,
  ConnectionState,
} from '../types/streams'

const RETRY_DELAYS = [1000, 2000, 5000, 10000, 20000, 30000] // exponential backoff capped at 30s
const HEARTBEAT_INTERVAL = 5000
const HEARTBEAT_TIMEOUT = 15000

export interface WebSocketClientConfig {
  url: string
  onGlobalUpdate: (data: GlobalStream) => void
  onTracksUpdate: (data: TrackStream[]) => void
  onStateChange: (state: ConnectionState) => void
  onError: (error: Error) => void
}

export class WebSocketClient {
  private socket: Socket | null = null
  private config: WebSocketClientConfig
  private state: ConnectionState = 'idle'
  private retryCount = 0
  private retryTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private heartbeatTimeout: NodeJS.Timeout | null = null

  constructor(config: WebSocketClientConfig) {
    this.config = config
  }

  connect(): void {
    if (this.state === 'connecting' || this.state === 'open') {
      return
    }

    this.setState('connecting')
    this.clearTimers()

    try {
      this.socket = io(this.config.url, {
        transports: ['websocket'],
        reconnection: false, // We handle reconnection manually
        timeout: 10000,
      })

      this.socket.on('connect', () => {
        console.log('[WebSocket] Connected')
        this.setState('open')
        this.retryCount = 0
        this.startHeartbeat()
      })

      this.socket.on('global', (data: GlobalStream) => {
        this.resetHeartbeatTimeout()
        this.config.onGlobalUpdate(data)
      })

      this.socket.on('tracks', (data: TrackStream[]) => {
        this.resetHeartbeatTimeout()
        this.config.onTracksUpdate(data)
      })

      this.socket.on('pong', () => {
        this.resetHeartbeatTimeout()
      })

      this.socket.on('disconnect', (reason) => {
        console.log('[WebSocket] Disconnected:', reason)
        this.setState('closed')
        this.scheduleReconnect()
      })

      this.socket.on('connect_error', (error) => {
        console.error('[WebSocket] Connection error:', error.message)
        this.config.onError(error)
        this.setState('closed')
        this.scheduleReconnect()
      })

      this.socket.on('error', (error) => {
        console.error('[WebSocket] Error:', error)
        this.config.onError(new Error(error))
      })
    } catch (error) {
      console.error('[WebSocket] Failed to create socket:', error)
      this.config.onError(error as Error)
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    this.clearTimers()
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.setState('idle')
  }

  private setState(state: ConnectionState): void {
    if (this.state !== state) {
      this.state = state
      this.config.onStateChange(state)
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('ping')
      }
    }, HEARTBEAT_INTERVAL)

    this.resetHeartbeatTimeout()
  }

  private resetHeartbeatTimeout(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout)
    }

    this.heartbeatTimeout = setTimeout(() => {
      console.warn('[WebSocket] Heartbeat timeout - no response from server')
      this.disconnect()
      this.scheduleReconnect()
    }, HEARTBEAT_TIMEOUT)
  }

  private scheduleReconnect(): void {
    if (this.retryTimer) {
      return
    }

    const delay =
      RETRY_DELAYS[Math.min(this.retryCount, RETRY_DELAYS.length - 1)]
    console.log(
      `[WebSocket] Reconnecting in ${delay}ms (attempt ${this.retryCount + 1})`
    )

    this.setState('retrying')

    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      this.retryCount++

      // After max retries, switch to demo mode
      if (this.retryCount >= RETRY_DELAYS.length) {
        console.warn('[WebSocket] Max retries reached, switching to demo mode')
        this.setState('demo')
        this.retryCount = 0
      } else {
        this.connect()
      }
    }, delay)
  }

  private clearTimers(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout)
      this.heartbeatTimeout = null
    }
  }

  getState(): ConnectionState {
    return this.state
  }

  isConnected(): boolean {
    return this.state === 'open'
  }
}
