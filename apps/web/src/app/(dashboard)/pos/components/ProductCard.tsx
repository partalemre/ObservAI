import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { formatCurrency } from '../../../../lib/format'

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  rating?: number
  description?: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <motion.div
      className={`glass-card group relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
        product.inStock
          ? 'hover:shadow-primary-500/10 hover:border-primary-500/30 hover:shadow-lg'
          : 'cursor-not-allowed opacity-50'
      } `}
      whileHover={product.inStock ? { y: -2 } : {}}
      whileTap={product.inStock ? { scale: 0.98 } : {}}
    >
      {/* Product Image */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-primary-400 text-lg font-bold">
                {product.name.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-xs font-medium text-white">
              {product.rating}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">Tükendi</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="line-clamp-2 text-sm leading-tight font-medium text-white">
          {product.name}
        </h3>

        {product.description && (
          <p className="line-clamp-2 text-xs text-gray-400">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-primary-300 text-lg font-bold">
            {formatCurrency(product.price)}
          </div>

          {product.inStock && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onAdd(product)
              }}
              className="bg-primary-500 hover:bg-primary-600 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="h-4 w-4 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {product.inStock && (
        <div className="bg-primary-500/5 pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}
    </motion.div>
  )
}
