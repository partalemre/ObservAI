interface UseRealtimeDataOptions {
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  onReconnecting?: (attempt: number) => void
}
interface UseRealtimeDataReturn<T> {
  data: T | null
  isConnected: boolean
  isReconnecting: boolean
  error: string | null
  reconnectAttempt: number
  lastUpdate: Date | null
  send: (data: any) => boolean
  reconnect: () => void
  disconnect: () => void
}
export declare const useRealtimeData: <T = any>(
  channel: string,
  options?: UseRealtimeDataOptions
) => UseRealtimeDataReturn<T>
export declare const useRealtimeMetrics: () => UseRealtimeDataReturn<any>
export declare const useRealtimeOrders: () => UseRealtimeDataReturn<any>
export declare const useRealtimeKitchen: () => UseRealtimeDataReturn<any>
export {}
