import { useState, useEffect, useCallback, useRef } from 'react'

interface WebSocketMessage {
  channel: string
  data: any
  timestamp: number
  type: 'data' | 'error' | 'ping' | 'pong'
}

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

export const useRealtimeData = <T = any>(
  channel: string,
  options: UseRealtimeDataOptions = {}
): UseRealtimeDataReturn<T> => {
  const {
    reconnectAttempts = 5,
    reconnectDelay = 1000,
    heartbeatInterval = 30000,
    onConnect,
    onDisconnect,
    onError,
    onReconnecting,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)

  const getWebSocketUrl = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws'
    return wsUrl
  }, [])

  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }, [heartbeatInterval])

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl()
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`WebSocket connected to channel: ${channel}`)
        setIsConnected(true)
        setIsReconnecting(false)
        setError(null)
        setReconnectAttempt(0)

        // Subscribe to channel
        ws.send(
          JSON.stringify({
            type: 'subscribe',
            channel,
            timestamp: Date.now(),
          })
        )

        startHeartbeat()
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          if (message.type === 'pong') {
            // Handle heartbeat response
            return
          }

          if (message.channel === channel && message.type === 'data') {
            setData(message.data)
            setLastUpdate(new Date())
          }
        } catch (parseError) {
          console.error('Failed to parse WebSocket message:', parseError)
          setError('Failed to parse message')
        }
      }

      ws.onerror = (errorEvent) => {
        console.error('WebSocket error:', errorEvent)
        setError('Connection error')
        setIsConnected(false)
        onError?.(errorEvent)
      }

      ws.onclose = (closeEvent) => {
        console.log('WebSocket closed:', closeEvent.code, closeEvent.reason)
        setIsConnected(false)
        clearTimeouts()
        onDisconnect?.()

        // Attempt to reconnect if not manually closed
        if (
          shouldReconnectRef.current &&
          reconnectAttempt < reconnectAttempts
        ) {
          const nextAttempt = reconnectAttempt + 1
          setReconnectAttempt(nextAttempt)
          setIsReconnecting(true)
          onReconnecting?.(nextAttempt)

          const delay = reconnectDelay * Math.pow(2, nextAttempt - 1) // Exponential backoff

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else {
          setIsReconnecting(false)
          if (reconnectAttempt >= reconnectAttempts) {
            setError(`Failed to reconnect after ${reconnectAttempts} attempts`)
          }
        }
      }
    } catch (connectionError) {
      console.error('Failed to create WebSocket connection:', connectionError)
      setError('Failed to create connection')
      setIsConnected(false)
    }
  }, [
    channel,
    reconnectAttempt,
    reconnectAttempts,
    reconnectDelay,
    getWebSocketUrl,
    startHeartbeat,
    clearTimeouts,
    onConnect,
    onDisconnect,
    onError,
    onReconnecting,
  ])

  const send = useCallback(
    (data: any): boolean => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(
            JSON.stringify({
              channel,
              data,
              timestamp: Date.now(),
              type: 'data',
            })
          )
          return true
        } catch (sendError) {
          console.error('Failed to send WebSocket message:', sendError)
          setError('Failed to send message')
          return false
        }
      }
      return false
    },
    [channel]
  )

  const reconnect = useCallback(() => {
    setReconnectAttempt(0)
    setError(null)
    shouldReconnectRef.current = true

    if (wsRef.current) {
      wsRef.current.close()
    }

    connect()
  }, [connect])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    clearTimeouts()

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
    }

    setIsConnected(false)
    setIsReconnecting(false)
  }, [clearTimeouts])

  // Initialize connection
  useEffect(() => {
    shouldReconnectRef.current = true
    connect()

    return () => {
      shouldReconnectRef.current = false
      clearTimeouts()
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmount')
      }
    }
  }, [connect, clearTimeouts])

  return {
    data,
    isConnected,
    isReconnecting,
    error,
    reconnectAttempt,
    lastUpdate,
    send,
    reconnect,
    disconnect,
  }
}

// Specialized hooks for different data types
export const useRealtimeMetrics = () => {
  return useRealtimeData('metrics', {
    heartbeatInterval: 10000, // More frequent for metrics
    onConnect: () => console.log('Metrics WebSocket connected'),
    onDisconnect: () => console.log('Metrics WebSocket disconnected'),
  })
}

export const useRealtimeOrders = () => {
  return useRealtimeData('orders', {
    onConnect: () => console.log('Orders WebSocket connected'),
    onDisconnect: () => console.log('Orders WebSocket disconnected'),
  })
}

export const useRealtimeKitchen = () => {
  return useRealtimeData('kitchen', {
    onConnect: () => console.log('Kitchen WebSocket connected'),
    onDisconnect: () => console.log('Kitchen WebSocket disconnected'),
  })
}
