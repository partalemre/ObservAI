import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { motion } from 'framer-motion'
import { Coffee, Sandwich, Cookie, Salad, Wine, Star } from 'lucide-react'
const categories = [
  { id: 'all', name: 'Tümü', icon: Star, color: 'text-primary-400' },
  { id: 'coffee', name: 'Kahve', icon: Coffee, color: 'text-amber-400' },
  { id: 'food', name: 'Yemek', icon: Sandwich, color: 'text-orange-400' },
  { id: 'dessert', name: 'Tatlı', icon: Cookie, color: 'text-pink-400' },
  { id: 'salad', name: 'Salata', icon: Salad, color: 'text-green-400' },
  { id: 'beverage', name: 'İçecek', icon: Wine, color: 'text-purple-400' },
]
export const CategoryTabs = ({ selected, onChange }) => {
  return _jsx('div', {
    className: 'flex flex-wrap gap-2',
    children: categories.map((category) => {
      const IconComponent = category.icon
      const isSelected = selected === category.id
      return _jsxs(
        motion.button,
        {
          onClick: () => onChange(category.id),
          className: `relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            isSelected
              ? 'bg-primary-500/20 text-primary-300 border-primary-500/30 border'
              : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          } `,
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          children: [
            isSelected &&
              _jsx(motion.div, {
                className: 'bg-primary-500/10 absolute inset-0 rounded-lg',
                layoutId: 'categoryBackground',
                initial: false,
                transition: { type: 'spring', bounce: 0.2, duration: 0.6 },
              }),
            _jsx(IconComponent, {
              className: `relative z-10 h-4 w-4 ${isSelected ? category.color : ''}`,
            }),
            _jsx('span', {
              className: 'relative z-10',
              children: category.name,
            }),
          ],
        },
        category.id
      )
    }),
  })
}
