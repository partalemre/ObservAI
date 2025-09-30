import React from 'react'
interface StatProps {
  label: string
  value: number | string
  trend?: 'up' | 'down' | 'neutral'
  isNumeric?: boolean
}
export declare const Stat: React.FC<StatProps>
export {}
