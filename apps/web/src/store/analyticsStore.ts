/**
 * Analytics Store - Zustand
 * Global state management for real-time analytics data
 */

import { create } from 'zustand'
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
  // Connection
  connectionState: ConnectionState
  wsClient: WebSocketClient | null
  mockGenerator: MockDataGenerator | null
  isDemoMode: boolean

  // Data
  globalData: GlobalStream | null
  tracks: TrackStream[]
  history: GlobalStream[] // Rolling window of last N samples
  maxHistory: number

  // UI
  toasts: ToastEvent[]
  performance: PerformanceMetrics

  // Actions
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

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  connectionState: 'idle',
  wsClient: null,
  mockGenerator: null,
  isDemoMode: false,
  globalData: null,
  tracks: [],
  history: [],
  maxHistory: 600, // 10 minutes at 1 sample/sec
  toasts: [],
  performance: {
    fps: 0,
    droppedFrames: 0,
    latency: 0,
  },

  // Actions
  setConnectionState: (state) => {
    set({ connectionState: state })

    // Auto-enable demo mode if connection fails
    if (state === 'demo') {
      const mock = get().mockGenerator
      if (!mock) {
        const generator = new MockDataGenerator(
          (data) => get().setGlobalData(data),
          (tracks) => get().setTracks(tracks)
        )
        generator.start()
        set({ mockGenerator: generator, isDemoMode: true })
        get().addToast({
          type: 'warning',
          title: 'Demo Mode',
          message: 'Live connection unavailable. Showing simulated data.',
        })
      }
    }
  },

  setGlobalData: (data) => {
    const { history, maxHistory } = get()
    const newHistory = [...history, data]
    if (newHistory.length > maxHistory) {
      newHistory.shift()
    }

    set({ globalData: data, history: newHistory })

    // Generate alerts based on thresholds
    if (data.queue > 8) {
      get().addToast({
        type: 'warning',
        title: 'High Queue Count',
        message: `Queue has ${data.queue} people waiting.`,
        duration: 5000,
      })
    }
  },

  setTracks: (tracks) => {
    set({ tracks })

    // Check for long dwell times
    tracks.forEach((track) => {
      if (track.dwellSec > 600 && track.state === 'present') {
        get().addToast({
          type: 'info',
          title: 'Long Dwell Time',
          message: `Person ${track.id} has been present for ${Math.floor(track.dwellSec / 60)} minutes.`,
          duration: 3000,
        })
      }
    })
  },

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random()}`
    const newToast: ToastEvent = {
      ...toast,
      id,
      timestamp: Date.now(),
      duration: toast.duration || 4000,
    }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(id)
    }, newToast.duration)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  updatePerformance: (metrics) => {
    set((state) => ({
      performance: { ...state.performance, ...metrics },
    }))
  },

  toggleDemoMode: () => {
    const { isDemoMode, mockGenerator, wsClient } = get()

    if (isDemoMode) {
      // Switch to live mode
      if (mockGenerator) {
        mockGenerator.stop()
        set({ mockGenerator: null })
      }
      if (wsClient) {
        wsClient.connect()
      }
      set({ isDemoMode: false })
      get().addToast({
        type: 'success',
        title: 'Live Mode',
        message: 'Attempting to connect to live stream...',
      })
    } else {
      // Switch to demo mode
      if (wsClient) {
        wsClient.disconnect()
      }
      const generator = new MockDataGenerator(
        (data) => get().setGlobalData(data),
        (tracks) => get().setTracks(tracks)
      )
      generator.start()
      set({
        mockGenerator: generator,
        isDemoMode: true,
        connectionState: 'demo',
      })
      get().addToast({
        type: 'info',
        title: 'Demo Mode',
        message: 'Now showing simulated data.',
      })
    }
  },

  initConnection: (wsUrl) => {
    const { wsClient } = get()

    // Cleanup existing client
    if (wsClient) {
      wsClient.disconnect()
    }

    const client = new WebSocketClient({
      url: wsUrl,
      onGlobalUpdate: (data) => get().setGlobalData(data),
      onTracksUpdate: (tracks) => get().setTracks(tracks),
      onStateChange: (state) => get().setConnectionState(state),
      onError: (error) => {
        console.error('WebSocket error:', error)
        get().addToast({
          type: 'error',
          title: 'Connection Error',
          message: error.message,
        })
      },
    })

    set({ wsClient: client })
    client.connect()
  },

  disconnect: () => {
    const { wsClient, mockGenerator } = get()

    if (wsClient) {
      wsClient.disconnect()
      set({ wsClient: null })
    }

    if (mockGenerator) {
      mockGenerator.stop()
      set({ mockGenerator: null })
    }

    set({
      connectionState: 'idle',
      isDemoMode: false,
      globalData: null,
      tracks: [],
      history: [],
    })
  },
}))
