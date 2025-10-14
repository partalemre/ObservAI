/**
 * WebSocket Client with auto-reconnection and exponential backoff
 * Supports both live stream and fallback to mock data
 */
import { io } from 'socket.io-client'
const RETRY_DELAYS = [1000, 2000, 5000, 10000, 20000, 30000] // exponential backoff capped at 30s
const HEARTBEAT_INTERVAL = 5000
const HEARTBEAT_TIMEOUT = 15000
export class WebSocketClient {
  socket = null
  config
  state = 'idle'
  retryCount = 0
  retryTimer = null
  heartbeatTimer = null
  heartbeatTimeout = null
  constructor(config) {
    this.config = config
  }
  connect() {
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
      this.socket.on('global', (data) => {
        this.resetHeartbeatTimeout()
        this.config.onGlobalUpdate(data)
      })
      this.socket.on('tracks', (data) => {
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
      this.config.onError(error)
      this.scheduleReconnect()
    }
  }
  disconnect() {
    this.clearTimers()
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.setState('idle')
  }
  setState(state) {
    if (this.state !== state) {
      this.state = state
      this.config.onStateChange(state)
    }
  }
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('ping')
      }
    }, HEARTBEAT_INTERVAL)
    this.resetHeartbeatTimeout()
  }
  resetHeartbeatTimeout() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout)
    }
    this.heartbeatTimeout = setTimeout(() => {
      console.warn('[WebSocket] Heartbeat timeout - no response from server')
      this.disconnect()
      this.scheduleReconnect()
    }, HEARTBEAT_TIMEOUT)
  }
  scheduleReconnect() {
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
  clearTimers() {
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
  getState() {
    return this.state
  }
  isConnected() {
    return this.state === 'open'
  }
}
