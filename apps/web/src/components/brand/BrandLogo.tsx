import React from 'react'
import { BrandMark } from './BrandMark'

interface BrandLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showGlow?: boolean
  orientation?: 'horizontal' | 'vertical'
}

const sizeMap = {
  sm: { mark: 24, text: 'text-lg' },
  md: { mark: 32, text: 'text-xl' },
  lg: { mark: 40, text: 'text-2xl' },
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = false,
  orientation = 'horizontal',
}) => {
  const { mark, text } = sizeMap[size]

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <BrandMark size={mark} showGlow={showGlow} />
        <span className={`font-display text-ink font-bold ${text}`}>
          ObservAI
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandMark size={mark} showGlow={showGlow} />
      <span className={`font-display text-ink font-bold ${text}`}>
        ObservAI
      </span>
    </div>
  )
}
