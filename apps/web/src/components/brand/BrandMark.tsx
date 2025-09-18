import React from 'react'

interface BrandMarkProps {
  className?: string
  size?: number
  showGlow?: boolean
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  className = '',
  size = 40,
  showGlow = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {showGlow && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Eye outline */}
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="12"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-ink"
      />

      {/* Rising bars (iris) */}
      <g className="text-brand" filter={showGlow ? 'url(#glow)' : undefined}>
        {/* Left bar */}
        <rect x="13" y="18" width="3" height="8" rx="1.5" fill="currentColor" />

        {/* Center bar (highest) */}
        <rect
          x="18.5"
          y="14"
          width="3"
          height="12"
          rx="1.5"
          fill="currentColor"
        />

        {/* Right bar */}
        <rect
          x="24"
          y="16"
          width="3"
          height="10"
          rx="1.5"
          fill="currentColor"
        />
      </g>

      {/* Pupil */}
      <circle cx="20" cy="20" r="2" fill="currentColor" className="text-ink" />
    </svg>
  )
}
