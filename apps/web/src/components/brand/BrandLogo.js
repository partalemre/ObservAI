import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { BrandMark } from './BrandMark'
const sizeMap = {
  sm: { mark: 24, text: 'text-lg' },
  md: { mark: 32, text: 'text-xl' },
  lg: { mark: 40, text: 'text-2xl' },
}
export const BrandLogo = ({
  className = '',
  size = 'md',
  showGlow = false,
  orientation = 'horizontal',
}) => {
  const { mark, text } = sizeMap[size]
  if (orientation === 'vertical') {
    return _jsxs('div', {
      className: `flex flex-col items-center gap-2 ${className}`,
      children: [
        _jsx(BrandMark, { size: mark, showGlow: showGlow }),
        _jsx('span', {
          className: `font-display text-ink font-bold ${text}`,
          children: 'ObservAI',
        }),
      ],
    })
  }
  return _jsxs('div', {
    className: `flex items-center gap-3 ${className}`,
    children: [
      _jsx(BrandMark, { size: mark, showGlow: showGlow }),
      _jsx('span', {
        className: `font-display text-ink font-bold ${text}`,
        children: 'ObservAI',
      }),
    ],
  })
}
