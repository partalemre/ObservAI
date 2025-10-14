/**
 * Analytics Store - Zustand
 * Global state management for real-time analytics data
 */
import type {
  GlobalStream,
  TrackStream,
  ConnectionState,
  ToastEvent,
  PerformanceMetrics,
} from '../types/streams'
import { WebSocketClient } from '../lib/websocket-client'
import { MockDataGenerator } from '../lib/mock-generator'
interface AnalyticsState {
  connectionState: ConnectionState
  wsClient: WebSocketClient | null
  mockGenerator: MockDataGenerator | null
  isDemoMode: boolean
  globalData: GlobalStream | null
  tracks: TrackStream[]
  history: GlobalStream[]
  maxHistory: number
  toasts: ToastEvent[]
  performance: PerformanceMetrics
  setConnectionState: (state: ConnectionState) => void
  setGlobalData: (data: GlobalStream) => void
  setTracks: (tracks: TrackStream[]) => void
  addToast: (toast: Omit<ToastEvent, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void
  toggleDemoMode: () => void
  initConnection: (wsUrl: string) => void
  disconnect: () => void
}
export declare const useAnalyticsStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<AnalyticsState>
>
export {}
