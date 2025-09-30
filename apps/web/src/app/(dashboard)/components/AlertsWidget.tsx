import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { fetchAlerts } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'

interface Alert {
  id: number
  type: 'warning' | 'info' | 'error' | 'success'
  message: string
  time: string
}

export const AlertsWidget: React.FC = () => {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000, // 15 saniyede bir güncelle
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'info':
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    }
  }

  const getPulseColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-400'
      case 'error':
        return 'bg-red-400'
      case 'success':
        return 'bg-green-400'
      case 'info':
      default:
        return 'bg-blue-400'
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
            <Bell className="h-5 w-5 text-red-400" />
            {alerts && alerts.length > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {alerts.length}
              </motion.div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Uyarılar</h3>
            <p className="text-sm text-white/60">Anlık bildirimler</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">
          <Clock className="h-3 w-3" />
          Canlı
        </div>
      </div>

      <div className="custom-scrollbar max-h-64 space-y-3 overflow-y-auto">
        <AnimatePresence>
          {alerts && alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02] ${getAlertStyle(alert.type)}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    {getAlertIcon(alert.type)}
                    <motion.div
                      className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${getPulseColor(alert.type)}`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-sm font-medium text-white/90">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs opacity-70">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="py-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white/60">Aktif uyarı yok</p>
              <p className="mt-1 text-sm text-white/40">
                Sistem normal çalışıyor
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {alerts && alerts.length > 3 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <button className="text-primary-400 hover:text-primary-300 w-full text-sm font-medium transition-colors duration-200">
            Tümünü Görüntüle ({alerts.length - 3} daha)
          </button>
        </div>
      )}
    </motion.div>
  )
}
