import React from 'react'
import { motion } from 'framer-motion'
import { useCameraWebSocket } from '../../../hooks/useCameraWebSocket'
import { Stat } from './components/Stat'
import { HeatMapVisualization } from './components/HeatMapVisualization'
import { GenderDistribution } from './components/GenderDistribution'
import { AgeDistribution } from './components/AgeDistribution'
import { TrafficTimeline } from './components/TrafficTimeline'
import { Camera, Wifi, WifiOff, RefreshCw, Users, Clock } from 'lucide-react'

const CameraAnalytics: React.FC = () => {
  const {
    data: liveData,
    connected,
    error,
    reconnecting,
    reconnect,
  } = useCameraWebSocket()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      className="bg-dark-900 min-h-screen space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-xl">
            <Camera className="text-primary-400 h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Kamera Analitiği
            </h1>
            <p className="mt-1 text-white/70">
              Gerçek zamanlı müşteri davranış analizi
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-3">
          {error && (
            <motion.button
              onClick={reconnect}
              className="glass-button flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:text-red-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw
                className={`h-4 w-4 ${reconnecting ? 'animate-spin' : ''}`}
              />
              Yeniden Bağlan
            </motion.button>
          )}

          <div className="glass-card flex items-center gap-2 rounded-lg px-3 py-2">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Bağlı</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">
                  {reconnecting ? 'Bağlanıyor...' : 'Bağlantı Yok'}
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Live Stats Bar */}
      <motion.div
        className="glass-card flex flex-col justify-between gap-4 rounded-xl p-4 sm:flex-row sm:items-center"
        variants={itemVariants}
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-3 w-3 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-sm text-white/70">Canlı</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-primary-400 h-5 w-5" />
            <div className="text-white">
              <span className="text-primary-300 text-2xl font-bold">
                {liveData?.current || 0}
              </span>
              <span className="ml-2 text-sm text-white/70">kişi içeride</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Stat label="Giriş" value={liveData?.entriesHour || 0} trend="up" />
          <Stat label="Çıkış" value={liveData?.exitsHour || 0} trend="down" />
          <Stat
            label="Ortalama Süre"
            value={`${liveData?.avgDuration || 0}dk`}
            isNumeric={false}
          />
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Clock className="h-3 w-3" />
            {liveData?.lastUpdate && (
              <span>
                {new Date(liveData.lastUpdate).toLocaleTimeString('tr-TR')}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6"
        variants={itemVariants}
      >
        {/* Heat Map - 2 columns */}
        <div className="lg:col-span-2">
          <HeatMapVisualization
            data={liveData?.heatmap}
            floorPlan="/cafe-layout.svg"
            loading={!connected}
          />
        </div>

        {/* Demographics */}
        <div className="space-y-4 lg:space-y-6">
          <GenderDistribution data={liveData?.gender} loading={!connected} />
          <AgeDistribution data={liveData?.age} loading={!connected} />
        </div>
      </motion.div>

      {/* Time Series */}
      <motion.div variants={itemVariants}>
        <TrafficTimeline data={liveData?.timeline} loading={!connected} />
      </motion.div>

      {/* Connection Error State */}
      {error && !connected && (
        <motion.div
          className="glass-card rounded-xl border-red-500/20 bg-red-500/10 p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <WifiOff className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              Kamera Bağlantısı Kesildi
            </h3>
            <p className="mb-4 text-white/70">
              Lütfen kamera sistemi bağlantısını kontrol edin
            </p>
            <button
              onClick={reconnect}
              className="glass-button text-primary-400 hover:text-primary-300 rounded-lg px-4 py-2 transition-colors"
              disabled={reconnecting}
            >
              {reconnecting ? (
                <>
                  <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 inline h-4 w-4" />
                  Tekrar Dene
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CameraAnalytics
