export interface CameraLiveData {
  current: number
  entriesHour: number
  exitsHour: number
  avgDuration: number
  heatmap: Array<{
    x: number
    y: number
    intensity: number
    zone: string
  }>
  gender: {
    male: number
    female: number
    unknown: number
  }
  age: {
    '0-18': number
    '19-30': number
    '31-45': number
    '46-60': number
    '60+': number
  }
  timeline: Array<{
    timestamp: string
    entries: number
    exits: number
    occupancy: number
  }>
  lastUpdate: string
}
export declare const useCameraWebSocket: () => {
  data: CameraLiveData | null
  connected: boolean
  error: string | null
  reconnecting: boolean
  reconnect: () => void
  disconnect: () => void
}
