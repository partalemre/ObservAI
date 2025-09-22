import React, { useEffect, useRef } from 'react'

interface SoundProps {
  enabled: boolean
  newTicketsCount: number
}

export const Sound: React.FC<SoundProps> = ({ enabled, newTicketsCount }) => {
  const prevCountRef = useRef<number>(newTicketsCount)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (enabled && newTicketsCount > prevCountRef.current) {
      // New ticket detected, play beep
      playBeep()
    }
    prevCountRef.current = newTicketsCount
  }, [enabled, newTicketsCount])

  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }

  return null
}
