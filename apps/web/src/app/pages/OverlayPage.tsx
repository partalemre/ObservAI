/**
 * Overlay Page - Live video with PixiJS overlay
 * Supports MacBook camera (0), iPhone camera (1), and YouTube live streams
 */

import React, { useEffect, useRef, useState } from 'react'
import { Camera, Power } from 'lucide-react'
import { PixiOverlayRenderer } from '../../lib/pixi-overlay'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { LiveKpiPanel } from '../../components/panels/LiveKpiPanel'
import { DemographicsPanel } from '../../components/panels/DemographicsPanel'
import { HeatmapPanel } from '../../components/panels/HeatmapPanel'
import { ToastContainer } from '../../components/panels/ToastContainer'
import { PerformanceHud } from '../../components/panels/PerformanceHud'

type CameraSource = 'macbook' | 'iphone' | 'youtube' | null

export const OverlayPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayContainerRef = useRef<HTMLDivElement>(null)
  const pixiRendererRef = useRef<PixiOverlayRenderer | null>(null)
  const [cameraSource, setCameraSource] = useState<CameraSource>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>('')

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
  const startCamera = async (source: CameraSource) => {
    if (!videoRef.current) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser does not support getUserMedia API.')
      return
    }

    setError('')

    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      if (source === 'macbook' || source === 'iphone') {
        console.log(`Requesting camera access for: ${source}`)

        // Request a temporary stream to unlock device labels (permission prompt)
        let permissionStream: MediaStream | null = null
        try {
          permissionStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
        } catch (permissionError: any) {
          throw permissionError
        } finally {
          if (permissionStream) {
            permissionStream.getTracks().forEach((track) => track.stop())
          }
        }

        // Enumerate devices after permission granted
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((d) => d.kind === 'videoinput')

        if (!videoDevices.length) {
          throw Object.assign(new Error('No camera devices detected.'), {
            name: 'NotFoundError',
          })
        }

        console.log('Available video devices:', videoDevices)

        let targetDevice: MediaDeviceInfo | undefined
        if (source === 'iphone') {
          // Try to match Continuity Camera / iPhone labels
          targetDevice =
            videoDevices.find((device) =>
              /iphone|ios|continuity/i.test(device.label)
            ) || videoDevices[1]
        } else {
          targetDevice = videoDevices[0]
        }

        // Base constraints
        let constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 60, max: 60 },
            facingMode: source === 'macbook' ? 'user' : 'environment',
          },
          audio: false,
        }

        if (targetDevice?.deviceId) {
          constraints = {
            ...constraints,
            video: {
              ...constraints.video,
              deviceId: { exact: targetDevice.deviceId },
            },
          }
        }

        console.log('Requesting getUserMedia with constraints:', constraints)

        let mediaStream: MediaStream
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (constraintError: any) {
          if (
            constraintError.name === 'OverconstrainedError' ||
            constraintError.name === 'NotFoundError'
          ) {
            console.warn(
              'Camera with specific constraints not found, falling back to default device.',
              constraintError
            )
            const fallbackConstraints: MediaStreamConstraints = {
              ...constraints,
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 60, max: 60 },
              },
            }
            mediaStream =
              await navigator.mediaDevices.getUserMedia(fallbackConstraints)
          } else {
            throw constraintError
          }
        }

        console.log('Got media stream:', mediaStream.getTracks())

        const videoElement = videoRef.current
        if (!videoElement) {
          mediaStream.getTracks().forEach((track) => track.stop())
          throw new Error('Video element unavailable')
        }

        // Attach stream and wait until metadata is ready
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(() => {
            cleanup()
            reject(new Error('Video load timeout'))
          }, 10000)

          const cleanup = () => {
            window.clearTimeout(timeout)
            if (videoElement) {
              videoElement.onloadedmetadata = null
              videoElement.onerror = null
            }
          }

          videoElement.onloadedmetadata = () => {
            cleanup()
            resolve()
          }

          videoElement.onerror = (event) => {
            cleanup()
            reject(
              new Error(
                `Video element error: ${
                  (event as any)?.message ?? 'unknown error'
                }`
              )
            )
          }

          videoElement.srcObject = mediaStream
          const playPromise = videoElement.play()
          if (playPromise) {
            playPromise.catch((playError) => {
              cleanup()
              reject(playError)
            })
          }
        })

        console.log(
          'Video ready:',
          videoElement.videoWidth,
          'x',
          videoElement.videoHeight
        )

        setStream(mediaStream)
        setCameraSource(source)

        if (pixiRendererRef.current) {
          pixiRendererRef.current.destroy()
          pixiRendererRef.current = null
        }

        // Initialize PixiJS overlay after video is ready
        setTimeout(() => {
          if (
            overlayContainerRef.current &&
            videoRef.current &&
            !pixiRendererRef.current
          ) {
            const width = videoRef.current.videoWidth || 1280
            const height = videoRef.current.videoHeight || 720

            console.log('Initializing PixiJS overlay:', width, 'x', height)

            pixiRendererRef.current = new PixiOverlayRenderer({
              container: overlayContainerRef.current,
              width,
              height,
              videoElement: videoRef.current,
            })
          }
        }, 350)
      } else if (source === 'youtube' && youtubeUrl) {
        setError(
          `YouTube streams must be processed by Python backend. Use: ./start_camera_websocket.sh "${youtubeUrl}"`
        )
      }
    } catch (err: any) {
      console.error('Failed to start camera:', err)

      // Stop any partially opened streams
      if (videoRef.current?.srcObject instanceof MediaStream) {
        ;(videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }

      let errorMessage = 'Failed to access camera. '
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        errorMessage +=
          'Permission denied. Please allow camera access in your browser settings.'
      } else if (err.name === 'NotFoundError') {
        errorMessage +=
          'No camera found. Please connect a camera and try again.'
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.'
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += 'The requested camera is unavailable on this device.'
      } else {
        errorMessage += err.message || 'Unknown error'
      }

      setError(errorMessage)
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0b0b10]">
      {/* Video Container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          autoPlay
          playsInline
          muted
        />
        {/* PixiJS Overlay */}
        <div
          ref={overlayContainerRef}
          className="pointer-events-none absolute inset-0"
        />
      </div>

      {/* Control Panel (top center) */}
      {!cameraSource && (
        <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-xl border border-white/12 bg-[rgba(20,20,28,0.85)] p-6 backdrop-blur-[22px]">
            <h2 className="mb-4 text-center text-lg font-semibold text-white">
              Select Camera Source
            </h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => startCamera('macbook')}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Camera size={16} />
                MacBook Camera
              </button>
              <button
                onClick={() => startCamera('iphone')}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Camera size={16} />
                iPhone / External
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="YouTube Live URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <button
                onClick={() => startCamera('youtube')}
                disabled={!youtubeUrl}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                YouTube
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Need to grant camera permissions in your browser
            </p>
          </div>
        </div>
      )}

      {/* Stop Button */}
      {cameraSource && (
        <button
          onClick={stopCamera}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 rounded-lg border border-white/12 bg-[rgba(20,20,28,0.85)] px-4 py-2 text-sm font-medium text-white backdrop-blur-[22px] transition-colors hover:bg-red-600"
        >
          <Power size={16} />
          Stop Camera
        </button>
      )}

      {/* Left Panel - KPIs */}
      {cameraSource && (
        <div className="absolute top-6 left-6 z-40 w-80">
          <LiveKpiPanel />
        </div>
      )}

      {/* Right Panel - Demographics */}
      {cameraSource && (
        <div className="absolute top-6 right-6 z-40 max-h-[calc(100vh-3rem)] w-80 overflow-y-auto">
          <DemographicsPanel />
        </div>
      )}

      {/* Bottom Panel - Heatmap */}
      {cameraSource && globalData && (
        <div className="absolute bottom-6 left-1/2 z-40 w-96 -translate-x-1/2 transform">
          <HeatmapPanel data={globalData.heatmap} />
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />

      {/* Performance HUD */}
      <PerformanceHud />
    </div>
  )
}
