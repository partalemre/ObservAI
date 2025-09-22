import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
export const BrandMark = ({ className = '', size = 40, showGlow = false }) => {
  return _jsxs('svg', {
    width: size,
    height: size,
    viewBox: '0 0 40 40',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: className,
    children: [
      showGlow &&
        _jsx('defs', {
          children: _jsxs('filter', {
            id: 'glow',
            children: [
              _jsx('feGaussianBlur', {
                stdDeviation: '2',
                result: 'coloredBlur',
              }),
              _jsxs('feMerge', {
                children: [
                  _jsx('feMergeNode', { in: 'coloredBlur' }),
                  _jsx('feMergeNode', { in: 'SourceGraphic' }),
                ],
              }),
            ],
          }),
        }),
      _jsx('ellipse', {
        cx: '20',
        cy: '20',
        rx: '18',
        ry: '12',
        stroke: 'currentColor',
        strokeWidth: '2',
        fill: 'none',
        className: 'text-ink',
      }),
      _jsxs('g', {
        className: 'text-brand',
        filter: showGlow ? 'url(#glow)' : undefined,
        children: [
          _jsx('rect', {
            x: '13',
            y: '18',
            width: '3',
            height: '8',
            rx: '1.5',
            fill: 'currentColor',
          }),
          _jsx('rect', {
            x: '18.5',
            y: '14',
            width: '3',
            height: '12',
            rx: '1.5',
            fill: 'currentColor',
          }),
          _jsx('rect', {
            x: '24',
            y: '16',
            width: '3',
            height: '10',
            rx: '1.5',
            fill: 'currentColor',
          }),
        ],
      }),
      _jsx('circle', {
        cx: '20',
        cy: '20',
        r: '2',
        fill: 'currentColor',
        className: 'text-ink',
      }),
    ],
  })
}
