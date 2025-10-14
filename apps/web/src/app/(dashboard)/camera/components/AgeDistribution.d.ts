import React from 'react'
interface AgeData {
  '0-18': number
  '19-30': number
  '31-45': number
  '46-60': number
  '60+': number
}
interface AgeDistributionProps {
  data?: AgeData
  loading?: boolean
}
export declare const AgeDistribution: React.FC<AgeDistributionProps>
export {}
