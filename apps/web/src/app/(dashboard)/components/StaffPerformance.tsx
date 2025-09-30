import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Users, Star, Trophy } from 'lucide-react'
import { fetchStaffPerformance } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'

interface StaffMember {
  id: number
  name: string
  orders: number
  revenue: number
  rating: number
}

export const StaffPerformance: React.FC = () => {
  const { data: staff, isLoading } = useQuery<StaffMember[]>({
    queryKey: ['staff-performance'],
    queryFn: fetchStaffPerformance,
    refetchInterval: 30000,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.8) return 'text-green-400 bg-green-500/20'
    if (rating >= 4.5) return 'text-blue-400 bg-blue-500/20'
    if (rating >= 4.0) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const topPerformer = staff?.[0]

  return (
    <motion.div
      className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
          <Users className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Personel Performansı
          </h3>
          <p className="text-sm text-white/60">Günlük başarım sıralaması</p>
        </div>
      </div>

      <div className="space-y-4">
        {staff?.map((member, index) => (
          <motion.div
            key={member.id}
            className="group relative flex items-center gap-4 rounded-lg bg-white/5 p-3 transition-colors duration-200 hover:bg-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Rank Badge */}
            <div className="relative">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index === 0
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-primary-500/20 text-primary-400'
                } text-sm font-bold`}
              >
                {index === 0 ? <Trophy className="h-5 w-5" /> : `#${index + 1}`}
              </div>
              {index === 0 && (
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400">
                  <span className="text-xs text-black">👑</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="group-hover:text-primary-300 font-medium text-white transition-colors">
                  {member.name}
                </p>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getPerformanceColor(member.rating)}`}
                >
                  <Star className="h-3 w-3" fill="currentColor" />
                  {member.rating.toFixed(1)}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{member.orders} sipariş</span>
                <span className="text-accent-400 font-semibold">
                  {formatCurrency(member.revenue)}
                </span>
              </div>

              {/* Performance Bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-yellow-400' : 'bg-primary-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(member.rating / 5) * 100}%` }}
                  transition={{ delay: index * 0.2, duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Summary */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {staff?.reduce((sum, s) => sum + s.orders, 0) || 0}
            </p>
            <p className="text-xs text-white/60">Toplam Sipariş</p>
          </div>
          <div>
            <p className="text-accent-400 text-2xl font-bold">
              {(
                (staff?.reduce((sum, s) => sum + s.rating, 0) || 0) /
                (staff?.length || 1)
              ).toFixed(1)}
            </p>
            <p className="text-xs text-white/60">Ortalama Puan</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
