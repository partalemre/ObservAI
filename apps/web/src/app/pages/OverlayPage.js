import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
/**
 * Overlay Page - Live video with PixiJS overlay
 * Supports MacBook camera (0), iPhone camera (1), and YouTube live streams
 */
import { useEffect, useRef, useState } from 'react'
import { Camera, Power } from 'lucide-react'
import { PixiOverlayRenderer } from '../../lib/pixi-overlay'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { LiveKpiPanel } from '../../components/panels/LiveKpiPanel'
import { DemographicsPanel } from '../../components/panels/DemographicsPanel'
import { HeatmapPanel } from '../../components/panels/HeatmapPanel'
import { ToastContainer } from '../../components/panels/ToastContainer'
import { PerformanceHud } from '../../components/panels/PerformanceHud'
export const OverlayPage = () => {
  const videoRef = useRef(null)
  const overlayContainerRef = useRef(null)
  const pixiRendererRef = useRef(null)
  const [cameraSource, setCameraSource] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [stream, setStream] = useState(null)
  const { tracks, globalData, initConnection, disconnect, updatePerformance } =
    useAnalyticsStore()
  // Initialize WebSocket connection
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    initConnection(wsUrl)
    return () => {
      disconnect()
    }
  }, [initConnection, disconnect])
  // Start camera
  const startCamera = async (source) => {
    if (!videoRef.current) return
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (source === 'macbook' || source === 'iphone') {
        const deviceId = source === 'macbook' ? '0' : '1'
        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((d) => d.kind === 'videoinput')
        let constraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        }
        // Try to match device
        if (source === 'iphone') {
          // Look for external camera (iPhone)
          const externalCamera = videoDevices.find(
            (d) =>
              d.label.toLowerCase().includes('iphone') ||
              d.label.toLowerCase().includes('external')
          )
          if (externalCamera) {
            constraints.video = {
              ...constraints.video,
              deviceId: externalCamera.deviceId,
            }
          }
        }
        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints)
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setStream(mediaStream)
        setCameraSource(source)
        // Initialize PixiJS overlay
        if (overlayContainerRef.current && !pixiRendererRef.current) {
          pixiRendererRef.current = new PixiOverlayRenderer({
            container: overlayContainerRef.current,
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            videoElement: videoRef.current,
          })
        }
      } else if (source === 'youtube' && youtubeUrl) {
        // For YouTube, we'd need the Python backend to process it
        // For now, show a message
        alert(
          'YouTube streams are processed by the Python backend. Use: ./start_camera.sh "' +
            youtubeUrl +
            '" --display'
        )
      }
    } catch (error) {
      console.error('Failed to start camera:', error)
      alert('Failed to access camera. Please check permissions.')
    }
  }
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraSource(null)
    if (pixiRendererRef.current) {
      pixiRendererRef.current.destroy()
      pixiRendererRef.current = null
    }
  }
  // Update PixiJS overlay when tracks change
  useEffect(() => {
    if (pixiRendererRef.current && tracks) {
      pixiRendererRef.current.updateTracks(tracks)
    }
  }, [tracks])
  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simple FPS calculation
      const fps = 60 // TODO: Implement actual FPS measurement
      updatePerformance({ fps, droppedFrames: 0, latency: 0 })
    }, 1000)
    return () => clearInterval(interval)
  }, [updatePerformance])
  return _jsxs('div', {
    className: 'relative h-screen w-screen overflow-hidden bg-[#0b0b10]',
    children: [
      _jsxs('div', {
        className: 'absolute inset-0',
        children: [
          _jsx('video', {
            ref: videoRef,
            className: 'h-full w-full object-contain',
            autoPlay: true,
            playsInline: true,
            muted: true,
          }),
          _jsx('div', {
            ref: overlayContainerRef,
            className: 'pointer-events-none absolute inset-0',
          }),
        ],
      }),
      !cameraSource &&
        _jsx('div', {
          className: 'absolute left-1/2 top-8 z-50 -translate-x-1/2 transform',
          children: _jsxs('div', {
            className:
              'rounded-xl border border-white/12 bg-[rgba(20,20,28,0.85)] p-6 backdrop-blur-[22px]',
            children: [
              _jsx('h2', {
                className: 'mb-4 text-center text-lg font-semibold text-white',
                children: 'Select Camera Source',
              }),
              _jsxs('div', {
                className: 'flex gap-3',
                children: [
                  _jsxs('button', {
                    onClick: () => startCamera('macbook'),
                    className:
                      'flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700',
                    children: [_jsx(Camera, { size: 16 }), 'MacBook Camera'],
                  }),
                  _jsxs('button', {
                    onClick: () => startCamera('iphone'),
                    className:
                      'flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700',
                    children: [_jsx(Camera, { size: 16 }), 'iPhone Camera'],
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'mt-4 flex gap-2',
                children: [
                  _jsx('input', {
                    type: 'text',
                    placeholder: 'YouTube Live URL',
                    value: youtubeUrl,
                    onChange: (e) => setYoutubeUrl(e.target.value),
                    className:
                      'flex-1 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500',
                  }),
                  _jsx('button', {
                    onClick: () => startCamera('youtube'),
                    disabled: !youtubeUrl,
                    className:
                      'rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50',
                    children: 'YouTube',
                  }),
                ],
              }),
            ],
          }),
        }),
      cameraSource &&
        _jsxs('button', {
          onClick: stopCamera,
          className:
            'absolute right-8 top-8 z-50 flex items-center gap-2 rounded-lg border border-white/12 bg-[rgba(20,20,28,0.85)] px-4 py-2 text-sm font-medium text-white backdrop-blur-[22px] transition-colors hover:bg-red-600',
          children: [_jsx(Power, { size: 16 }), 'Stop Camera'],
        }),
      cameraSource &&
        _jsx('div', {
          className: 'absolute left-6 top-6 z-40 w-80',
          children: _jsx(LiveKpiPanel, {}),
        }),
      cameraSource &&
        _jsx('div', {
          className:
            'absolute right-6 top-6 z-40 w-80 max-h-[calc(100vh-3rem)] overflow-y-auto',
          children: _jsx(DemographicsPanel, {}),
        }),
      cameraSource &&
        globalData &&
        _jsx('div', {
          className:
            'absolute bottom-6 left-1/2 z-40 w-96 -translate-x-1/2 transform',
          children: _jsx(HeatmapPanel, { data: globalData.heatmap }),
        }),
      _jsx(ToastContainer, {}),
      _jsx(PerformanceHud, {}),
    ],
  })
}
