import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

interface StatProps {
  label: string
  value: number | string
  trend?: 'up' | 'down' | 'neutral'
  isNumeric?: boolean
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  trend = 'neutral',
  isNumeric = true,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-white/40" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-1 flex items-center justify-center gap-1">
        {getTrendIcon()}
        <div className={`text-xl font-bold ${getTrendColor()}`}>
          {isNumeric && typeof value === 'number' ? (
            <CountUp end={value} duration={1} useEasing={true} />
          ) : (
            value
          )}
        </div>
      </div>
      <div className="text-xs text-white/60">{label}</div>
    </motion.div>
  )
}
