import React from 'react'
interface GenderData {
  male: number
  female: number
  unknown: number
}
interface GenderDistributionProps {
  data?: GenderData
  loading?: boolean
}
export declare const GenderDistribution: React.FC<GenderDistributionProps>
export {}
