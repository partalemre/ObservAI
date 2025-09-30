import React from 'react'
import { motion } from 'framer-motion'
import { Coffee, Sandwich, Cookie, Salad, Wine, Star } from 'lucide-react'

interface CategoryTabsProps {
  selected: string
  onChange: (category: string) => void
}

const categories = [
  { id: 'all', name: 'Tümü', icon: Star, color: 'text-primary-400' },
  { id: 'coffee', name: 'Kahve', icon: Coffee, color: 'text-amber-400' },
  { id: 'food', name: 'Yemek', icon: Sandwich, color: 'text-orange-400' },
  { id: 'dessert', name: 'Tatlı', icon: Cookie, color: 'text-pink-400' },
  { id: 'salad', name: 'Salata', icon: Salad, color: 'text-green-400' },
  { id: 'beverage', name: 'İçecek', icon: Wine, color: 'text-purple-400' },
]

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const IconComponent = category.icon
        const isSelected = selected === category.id

        return (
          <motion.button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-primary-500/20 text-primary-300 border-primary-500/30 border'
                : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            } `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <motion.div
                className="bg-primary-500/10 absolute inset-0 rounded-lg"
                layoutId="categoryBackground"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <IconComponent
              className={`relative z-10 h-4 w-4 ${isSelected ? category.color : ''}`}
            />
            <span className="relative z-10">{category.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
