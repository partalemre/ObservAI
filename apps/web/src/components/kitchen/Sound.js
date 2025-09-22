import { useEffect, useRef } from 'react'
export const Sound = ({ enabled, newTicketsCount }) => {
  const prevCountRef = useRef(newTicketsCount)
  const audioContextRef = useRef(null)
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
          window.webkitAudioContext)()
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
