import React from 'react'
interface TimelineData {
  time: string
  entries: number
  exits: number
  occupancy: number
  timestamp: number
}
interface TrafficTimelineProps {
  data?: TimelineData[]
}
export declare const TrafficTimeline: React.FC<TrafficTimelineProps>
export {}
