import React from 'react'
import { motion } from 'framer-motion'
import { BrandMark } from '../brand/BrandMark'

interface LogoProps {
  collapsed: boolean
}

export const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ scale: collapsed ? 0.9 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {collapsed ? (
        // Small logo - just the mark
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <BrandMark size={32} className="text-primary-400" showGlow={true} />
          {/* Subtle glow effect */}
          <div className="bg-primary-500/20 absolute inset-0 -z-10 scale-150 rounded-full blur-xl" />
        </motion.div>
      ) : (
        // Full logo - mark + text
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <BrandMark size={32} className="text-primary-400" showGlow={true} />
            {/* Subtle glow effect */}
            <div className="bg-primary-500/20 absolute inset-0 -z-10 scale-150 rounded-full blur-xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="font-display text-lg font-bold text-white">
              ObservAI
            </span>
            <span className="-mt-1 text-xs text-white/60">
              Restaurant Analytics
            </span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
