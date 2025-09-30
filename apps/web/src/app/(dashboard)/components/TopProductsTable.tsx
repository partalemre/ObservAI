import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Package } from 'lucide-react'
import { fetchTopProducts } from '../../../lib/api/dashboard'
import { Skeleton } from '../../../components/ui'

interface TopProduct {
  id: number
  name: string
  quantity: number
  revenue: number
}

export const TopProductsTable: React.FC = () => {
  const { data: products, isLoading } = useQuery<TopProduct[]>({
    queryKey: ['top-products'],
    queryFn: fetchTopProducts,
    refetchInterval: 30000, // 30 saniyede bir güncelle
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent-500/20 flex h-10 w-10 items-center justify-center rounded-lg">
          <Package className="text-accent-400 h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">En Çok Satanlar</h3>
          <p className="text-sm text-white/60">Bugünün popüler ürünleri</p>
        </div>
      </div>

      <div className="space-y-4">
        {products?.map((product, index) => (
          <motion.div
            key={product.id}
            className="group flex items-center justify-between rounded-lg bg-white/5 p-3 transition-colors duration-200 hover:bg-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-500/20 text-primary-400 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                #{index + 1}
              </div>
              <div>
                <p className="group-hover:text-primary-300 font-medium text-white transition-colors">
                  {product.name}
                </p>
                <p className="text-sm text-white/60">{product.quantity} adet</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">
                {formatCurrency(product.revenue)}
              </p>
              <div className="flex items-center justify-end gap-1 text-sm text-green-400">
                <TrendingUp className="h-3 w-3" />
                <span>
                  +{((product.revenue / product.quantity) * 0.1).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Toplam Satış</span>
          <span className="font-semibold text-white">
            {formatCurrency(
              products?.reduce((sum, p) => sum + p.revenue, 0) || 0
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
