import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useEffect, useState, useRef } from 'react'
const CameraView = () => {
  const [metrics, setMetrics] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)
  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8001/ws')
    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMetrics(data)
      } catch (error) {
        console.error('Failed to parse metrics:', error)
      }
    }
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }
    wsRef.current = ws
    return () => {
      ws.close()
    }
  }, [])
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }
  const getOccupancyStatus = (occupants) => {
    if (occupants === 0)
      return { color: 'bg-gray-500/30 border-gray-400', label: 'Empty' }
    if (occupants <= 2)
      return { color: 'bg-green-500/30 border-green-400', label: 'Available' }
    if (occupants <= 4)
      return { color: 'bg-yellow-500/30 border-yellow-400', label: 'Moderate' }
    return { color: 'bg-red-500/30 border-red-400', label: 'Full' }
  }
  const getQueueAlert = (waitTime) => {
    return waitTime > 300 // Alert if wait > 5 minutes
  }
  return _jsxs('div', {
    className:
      'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4',
    children: [
      _jsxs('div', {
        className: 'mb-4 flex items-center justify-between',
        children: [
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              _jsx('div', {
                className: `h-3 w-3 rounded-full ${isConnected ? 'animate-pulse bg-green-400' : 'bg-red-400'}`,
              }),
              _jsx('span', {
                className: 'text-sm font-medium text-white',
                children: isConnected ? 'Camera Feed Active' : 'Disconnected',
              }),
            ],
          }),
          _jsx('div', {
            className: 'text-sm text-white/60',
            children: metrics?.ts && new Date(metrics.ts).toLocaleTimeString(),
          }),
        ],
      }),
      _jsxs('div', {
        className:
          'relative aspect-video overflow-hidden rounded-xl border border-purple-500/30 bg-black/50 backdrop-blur-sm',
        children: [
          _jsx('div', {
            className:
              'absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20',
          }),
          _jsx('div', {
            className: 'absolute inset-0 flex items-center justify-center',
            children: _jsx('div', {
              className: 'font-mono text-lg text-white/40',
              children: 'Live Camera Feed (Visualization Only)',
            }),
          }),
          metrics &&
            _jsxs('div', {
              className: 'absolute inset-0 p-6',
              children: [
                _jsxs('div', {
                  className: 'mb-4 flex gap-4',
                  children: [
                    _jsxs(GlassCard, {
                      children: [
                        _jsx('div', {
                          className: 'text-sm font-semibold text-green-400',
                          children: 'IN',
                        }),
                        _jsx('div', {
                          className: 'text-2xl font-bold text-white',
                          children: metrics.peopleIn,
                        }),
                      ],
                    }),
                    _jsxs(GlassCard, {
                      children: [
                        _jsx('div', {
                          className: 'text-sm font-semibold text-red-400',
                          children: 'OUT',
                        }),
                        _jsx('div', {
                          className: 'text-2xl font-bold text-white',
                          children: metrics.peopleOut,
                        }),
                      ],
                    }),
                    _jsxs(GlassCard, {
                      children: [
                        _jsx('div', {
                          className: 'text-sm font-semibold text-blue-400',
                          children: 'CURRENT',
                        }),
                        _jsx('div', {
                          className: 'text-2xl font-bold text-white',
                          children: metrics.current,
                        }),
                      ],
                    }),
                  ],
                }),
                metrics.queue.current > 0 &&
                  _jsx(GlassCard, {
                    className: `mb-4 ${
                      getQueueAlert(metrics.queue.longestWaitSeconds)
                        ? 'border-red-500 bg-red-500/20'
                        : ''
                    }`,
                    children: _jsxs('div', {
                      className: 'flex items-start justify-between',
                      children: [
                        _jsxs('div', {
                          children: [
                            _jsx('div', {
                              className:
                                'mb-1 text-sm font-semibold text-purple-400',
                              children: 'QUEUE',
                            }),
                            _jsxs('div', {
                              className: 'text-xl font-bold text-white',
                              children: [metrics.queue.current, ' waiting'],
                            }),
                            _jsxs('div', {
                              className: 'mt-1 text-xs text-white/60',
                              children: [
                                'Avg: ',
                                formatTime(metrics.queue.averageWaitSeconds),
                                ' | Longest: ',
                                formatTime(metrics.queue.longestWaitSeconds),
                              ],
                            }),
                          ],
                        }),
                        getQueueAlert(metrics.queue.longestWaitSeconds) &&
                          _jsx('div', {
                            className:
                              'animate-pulse text-xs font-bold text-red-400',
                            children: '\u26A0 ALERT',
                          }),
                      ],
                    }),
                  }),
                _jsx('div', {
                  className: 'mb-4 grid grid-cols-3 gap-3',
                  children: metrics.tables.map((table) => {
                    const status = getOccupancyStatus(table.currentOccupants)
                    const hasLongStay = table.longestStaySeconds > 3600 // Alert if > 1 hour
                    return _jsxs(
                      GlassCard,
                      {
                        className: `${status.color} ${hasLongStay ? 'border-orange-500' : ''}`,
                        children: [
                          _jsx('div', {
                            className: 'mb-1 text-sm font-bold text-white',
                            children: table.name || table.id,
                          }),
                          _jsx('div', {
                            className: 'mb-2 text-xs text-white/80',
                            children: status.label,
                          }),
                          _jsxs('div', {
                            className: 'text-lg font-bold text-white',
                            children: [
                              table.currentOccupants,
                              ' ',
                              table.currentOccupants === 1 ? 'guest' : 'guests',
                            ],
                          }),
                          table.currentOccupants > 0 &&
                            _jsxs('div', {
                              className: 'mt-1 text-xs text-white/50',
                              children: [
                                'Stay: ',
                                formatTime(table.longestStaySeconds),
                              ],
                            }),
                          hasLongStay &&
                            _jsx('div', {
                              className:
                                'mt-1 text-xs font-bold text-orange-400',
                              children: '\u23F0 Long Stay',
                            }),
                        ],
                      },
                      table.id
                    )
                  }),
                }),
                _jsxs('div', {
                  className: 'flex gap-4',
                  children: [
                    _jsxs(GlassCard, {
                      className: 'flex-1',
                      children: [
                        _jsx('div', {
                          className: 'mb-2 text-sm font-semibold text-cyan-400',
                          children: 'AGE GROUPS',
                        }),
                        _jsxs('div', {
                          className: 'space-y-1',
                          children: [
                            _jsx(DemoBar, {
                              label: 'Child (0-12)',
                              value: metrics.ageBuckets.child,
                              max: metrics.current,
                            }),
                            _jsx(DemoBar, {
                              label: 'Teen (13-19)',
                              value: metrics.ageBuckets.teen,
                              max: metrics.current,
                            }),
                            _jsx(DemoBar, {
                              label: 'Adult (20-59)',
                              value: metrics.ageBuckets.adult,
                              max: metrics.current,
                            }),
                            _jsx(DemoBar, {
                              label: 'Senior (60+)',
                              value: metrics.ageBuckets.senior,
                              max: metrics.current,
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsxs(GlassCard, {
                      className: 'flex-1',
                      children: [
                        _jsx('div', {
                          className: 'mb-2 text-sm font-semibold text-pink-400',
                          children: 'GENDER',
                        }),
                        _jsxs('div', {
                          className: 'space-y-1',
                          children: [
                            _jsx(DemoBar, {
                              label: 'Male',
                              value: metrics.gender.male,
                              max: metrics.current,
                            }),
                            _jsx(DemoBar, {
                              label: 'Female',
                              value: metrics.gender.female,
                              max: metrics.current,
                            }),
                            metrics.gender.unknown > 0 &&
                              _jsx(DemoBar, {
                                label: 'Unknown',
                                value: metrics.gender.unknown,
                                max: metrics.current,
                              }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          _jsx('div', {
            className: 'pointer-events-none absolute inset-0',
            children: _jsxs('svg', {
              className: 'h-full w-full opacity-10',
              children: [
                _jsx('defs', {
                  children: _jsx('pattern', {
                    id: 'grid',
                    width: '40',
                    height: '40',
                    patternUnits: 'userSpaceOnUse',
                    children: _jsx('path', {
                      d: 'M 40 0 L 0 0 0 40',
                      fill: 'none',
                      stroke: 'cyan',
                      strokeWidth: '0.5',
                    }),
                  }),
                }),
                _jsx('rect', {
                  width: '100%',
                  height: '100%',
                  fill: 'url(#grid)',
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  })
}
// Glassmorphism Card Component
const GlassCard = ({ children, className = '' }) => {
  return _jsx('div', {
    className: `rounded-lg border border-purple-500/30 bg-slate-800/40 p-3 shadow-lg backdrop-blur-md ${className}`,
    children: children,
  })
}
// Demographics Bar Component
const DemoBar = ({ label, value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0
  return _jsxs('div', {
    children: [
      _jsxs('div', {
        className: 'mb-1 flex justify-between text-xs text-white/70',
        children: [
          _jsx('span', { children: label }),
          _jsx('span', { className: 'font-mono', children: value }),
        ],
      }),
      _jsx('div', {
        className: 'h-2 overflow-hidden rounded-full bg-white/10',
        children: _jsx('div', {
          className:
            'h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500',
          style: { width: `${percentage}%` },
        }),
      }),
    ],
  })
}
export default CameraView
