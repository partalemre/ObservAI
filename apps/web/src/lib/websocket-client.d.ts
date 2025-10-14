/**
 * WebSocket Client with auto-reconnection and exponential backoff
 * Supports both live stream and fallback to mock data
 */
import type {
  GlobalStream,
  TrackStream,
  ConnectionState,
} from '../types/streams'
export interface WebSocketClientConfig {
  url: string
  onGlobalUpdate: (data: GlobalStream) => void
  onTracksUpdate: (data: TrackStream[]) => void
  onStateChange: (state: ConnectionState) => void
  onError: (error: Error) => void
}
export declare class WebSocketClient {
  private socket
  private config
  private state
  private retryCount
  private retryTimer
  private heartbeatTimer
  private heartbeatTimeout
  constructor(config: WebSocketClientConfig)
  connect(): void
  disconnect(): void
  private setState
  private startHeartbeat
  private resetHeartbeatTimeout
  private scheduleReconnect
  private clearTimers
  getState(): ConnectionState
  isConnected(): boolean
}
