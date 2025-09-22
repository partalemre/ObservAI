import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { cn } from '../../lib/utils'
export const Skeleton = ({ className }) => {
  return _jsx('div', {
    className: cn('animate-pulse rounded-md bg-gray-200', className),
  })
}
export const SkeletonCard = () => {
  return _jsxs('div', {
    className: 'rounded-lg border border-gray-200 p-4',
    children: [
      _jsx(Skeleton, { className: 'mb-2 h-4 w-3/4' }),
      _jsx(Skeleton, { className: 'mb-4 h-4 w-1/2' }),
      _jsx(Skeleton, { className: 'h-20 w-full' }),
    ],
  })
}
export const SkeletonTable = ({ rows = 5 }) => {
  return _jsx('div', {
    className: 'space-y-2',
    children: Array.from({ length: rows }).map((_, index) =>
      _jsxs(
        'div',
        {
          className: 'flex space-x-4',
          children: [
            _jsx(Skeleton, { className: 'h-4 w-1/4' }),
            _jsx(Skeleton, { className: 'h-4 w-1/3' }),
            _jsx(Skeleton, { className: 'h-4 w-1/5' }),
            _jsx(Skeleton, { className: 'h-4 w-1/6' }),
          ],
        },
        index
      )
    ),
  })
}
