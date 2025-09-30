import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { BrandMark } from '../brand/BrandMark'
export const Logo = ({ collapsed }) => {
  return _jsx(motion.div, {
    className: 'flex items-center justify-center',
    animate: { scale: collapsed ? 0.9 : 1 },
    transition: { duration: 0.2 },
    children: collapsed
      ? // Small logo - just the mark
        _jsxs(motion.div, {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: { duration: 0.2 },
          className: 'relative',
          children: [
            _jsx(BrandMark, {
              size: 32,
              className: 'text-primary-400',
              showGlow: true,
            }),
            _jsx('div', {
              className:
                'absolute inset-0 bg-primary-500/20 blur-xl rounded-full scale-150 -z-10',
            }),
          ],
        })
      : // Full logo - mark + text
        _jsxs(motion.div, {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: { duration: 0.3, ease: 'easeOut' },
          className: 'flex items-center gap-3',
          children: [
            _jsxs('div', {
              className: 'relative',
              children: [
                _jsx(BrandMark, {
                  size: 32,
                  className: 'text-primary-400',
                  showGlow: true,
                }),
                _jsx('div', {
                  className:
                    'absolute inset-0 bg-primary-500/20 blur-xl rounded-full scale-150 -z-10',
                }),
              ],
            }),
            _jsxs(motion.div, {
              initial: { opacity: 0, width: 0 },
              animate: { opacity: 1, width: 'auto' },
              exit: { opacity: 0, width: 0 },
              transition: { duration: 0.3, delay: 0.1 },
              className: 'flex flex-col',
              children: [
                _jsx('span', {
                  className: 'font-display font-bold text-lg text-white',
                  children: 'ObservAI',
                }),
                _jsx('span', {
                  className: 'text-xs text-white/60 -mt-1',
                  children: 'Restaurant Analytics',
                }),
              ],
            }),
          ],
        }),
  })
}
