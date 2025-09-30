import { useState, useEffect, useRef } from 'react'
import { useRealtimeData } from './useRealtimeData'
// Mock data generator for realistic camera analytics
const generateMockData = () => {
  const now = new Date()
  const hour = now.getHours()
  // Business logic based on time of day
  let baseCurrent = 15
  let baseEntries = 8
  // Rush hours: 8-10am, 12-2pm, 6-8pm
  if (
    (hour >= 8 && hour <= 10) ||
    (hour >= 12 && hour <= 14) ||
    (hour >= 18 && hour <= 20)
  ) {
    baseCurrent = 35
    baseEntries = 25
  } else if (hour >= 22 || hour <= 6) {
    baseCurrent = 3
    baseEntries = 2
  }
  const variance = (base, factor = 0.2) =>
    Math.max(0, Math.round(base + (Math.random() - 0.5) * base * factor))
  const current = variance(baseCurrent)
  const entries = variance(baseEntries)
  const exits = Math.max(0, entries - Math.floor(Math.random() * 5))
  return {
    current,
    entriesHour: entries,
    exitsHour: exits,
    avgDuration: variance(45, 0.3),
    heatmap: [
      { x: 50, y: 50, intensity: Math.random() * 100, zone: 'Giriş' },
      { x: 150, y: 50, intensity: Math.random() * 100, zone: 'Kasa' },
      {
        x: 250,
        y: 50,
        intensity: Math.random() * 100,
        zone: 'Sipariş Bankosu',
      },
      { x: 50, y: 150, intensity: Math.random() * 100, zone: 'Oturma Alanı 1' },
      {
        x: 150,
        y: 150,
        intensity: Math.random() * 100,
        zone: 'Oturma Alanı 2',
      },
      { x: 250, y: 150, intensity: Math.random() * 100, zone: 'Bar' },
      { x: 50, y: 250, intensity: Math.random() * 100, zone: 'Bahçe' },
      { x: 150, y: 250, intensity: Math.random() * 100, zone: 'Tuvalet' },
      { x: 250, y: 250, intensity: Math.random() * 100, zone: 'Çıkış' },
    ],
    gender: {
      male: variance(Math.floor(current * 0.45)),
      female: variance(Math.floor(current * 0.5)),
      unknown: variance(Math.floor(current * 0.05)),
    },
    age: {
      '0-18': variance(Math.floor(current * 0.15)),
      '19-30': variance(Math.floor(current * 0.35)),
      '31-45': variance(Math.floor(current * 0.3)),
      '46-60': variance(Math.floor(current * 0.15)),
      '60+': variance(Math.floor(current * 0.05)),
    },
    timeline: generateTimelineData(),
    lastUpdate: now.toISOString(),
  }
}
const generateTimelineData = () => {
  const data = []
  const now = new Date()
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000) // Every 5 minutes
    const hour = timestamp.getHours()
    const minute = timestamp.getMinutes()
    let baseOccupancy = 15
    let baseEntries = 2
    // Peak times
    if (
      (hour >= 8 && hour <= 10) ||
      (hour >= 12 && hour <= 14) ||
      (hour >= 18 && hour <= 20)
    ) {
      baseOccupancy = 35
      baseEntries = 8
    } else if (hour >= 22 || hour <= 6) {
      baseOccupancy = 3
      baseEntries = 0
    }
    const entries = Math.max(
      0,
      Math.round(baseEntries + (Math.random() - 0.5) * baseEntries * 0.5)
    )
    const exits = Math.max(0, entries - Math.floor(Math.random() * 3))
    const occupancy = Math.max(
      0,
      Math.round(baseOccupancy + (Math.random() - 0.5) * baseOccupancy * 0.3)
    )
    data.push({
      timestamp: timestamp.toISOString(),
      entries,
      exits,
      occupancy,
    })
  }
  return data
}
export const useCameraWebSocket = () => {
  const [mockData, setMockData] = useState(null)
  const mockIntervalRef = useRef(null)
  // Use the new real-time data hook for camera channel
  const {
    data: realTimeData,
    isConnected,
    isReconnecting,
    error,
    reconnect,
    disconnect,
  } = useRealtimeData('camera', {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatInterval: 30000,
    onConnect: () => {
      console.log('Camera WebSocket connected')
    },
    onDisconnect: () => {
      console.log('Camera WebSocket disconnected')
    },
    onError: (error) => {
      console.error('Camera WebSocket error:', error)
    },
    onReconnecting: (attempt) => {
      console.log(`Camera WebSocket reconnecting... attempt ${attempt}`)
    },
  })
  // Initialize mock data and start simulation
  useEffect(() => {
    // Generate initial mock data
    setMockData(generateMockData())
    // Start mock data updates every 2 seconds
    mockIntervalRef.current = setInterval(() => {
      setMockData(generateMockData())
    }, 2000)
    return () => {
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current)
      }
    }
  }, [])
  // Use real-time data if available, otherwise fall back to mock data
  const data = realTimeData || mockData
  return {
    data,
    connected: isConnected || !!mockData, // Consider connected if we have mock data
    error,
    reconnecting: isReconnecting,
    reconnect,
    disconnect: () => {
      disconnect()
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current)
        mockIntervalRef.current = null
      }
      setMockData(null)
    },
  }
}
