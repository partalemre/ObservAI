import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
export const Stat = ({ label, value, trend = 'neutral', isNumeric = true }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return _jsx(TrendingUp, { className: 'h-4 w-4 text-green-400' })
      case 'down':
        return _jsx(TrendingDown, { className: 'h-4 w-4 text-red-400' })
      default:
        return _jsx(Minus, { className: 'h-4 w-4 text-white/40' })
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
  return _jsxs(motion.div, {
    className: 'text-center',
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    children: [
      _jsxs('div', {
        className: 'mb-1 flex items-center justify-center gap-1',
        children: [
          getTrendIcon(),
          _jsx('div', {
            className: `text-xl font-bold ${getTrendColor()}`,
            children:
              isNumeric && typeof value === 'number'
                ? _jsx(CountUp, { end: value, duration: 1, useEasing: true })
                : value,
          }),
        ],
      }),
      _jsx('div', { className: 'text-xs text-white/60', children: label }),
    ],
  })
}
