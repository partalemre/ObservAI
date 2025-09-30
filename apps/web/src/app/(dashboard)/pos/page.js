import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, Filter, Zap } from 'lucide-react'
import { CategoryTabs } from './components/CategoryTabs'
import { ProductCard } from './components/ProductCard'
import { CartItem } from './components/CartItem'
import { CartSummary } from './components/CartSummary'
import { formatCurrency } from '../../../lib/format'
// Sample products data
const sampleProducts = [
  {
    id: '1',
    name: 'Americano',
    price: 25.0,
    category: 'coffee',
    rating: 4.8,
    description: 'Taze çekilmiş kahve çekirdekleri ile hazırlanmış',
    inStock: true,
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 30.0,
    category: 'coffee',
    rating: 4.9,
    description: 'Kremalı süt köpüğü ile servis edilir',
    inStock: true,
  },
  {
    id: '3',
    name: 'Latte',
    price: 32.0,
    category: 'coffee',
    rating: 4.7,
    description: 'Yumuşak süt köpüğü ve latte art ile',
    inStock: true,
  },
  {
    id: '4',
    name: 'Espresso',
    price: 20.0,
    category: 'coffee',
    rating: 4.6,
    description: 'Yoğun ve aromatik tek shot espresso',
    inStock: true,
  },
  {
    id: '5',
    name: 'Club Sandwich',
    price: 45.0,
    category: 'food',
    rating: 4.5,
    description: 'Tavuk, marul, domates ve mayonez ile',
    inStock: true,
  },
  {
    id: '6',
    name: 'Caesar Salad',
    price: 38.0,
    category: 'salad',
    rating: 4.4,
    description: 'Taze marul, parmesan ve caesar sosu',
    inStock: true,
  },
  {
    id: '7',
    name: 'Cheesecake',
    price: 28.0,
    category: 'dessert',
    rating: 4.8,
    description: 'Kremsi cheesecake üzeri berry sos',
    inStock: false,
  },
  {
    id: '8',
    name: 'Fresh Orange Juice',
    price: 18.0,
    category: 'beverage',
    rating: 4.3,
    description: 'Taze sıkılmış portakal suyu',
    inStock: true,
  },
  {
    id: '9',
    name: 'Croissant',
    price: 15.0,
    category: 'food',
    rating: 4.2,
    description: 'Tereyağlı, çıtır croissant',
    inStock: true,
  },
  {
    id: '10',
    name: 'Iced Coffee',
    price: 28.0,
    category: 'coffee',
    rating: 4.6,
    description: 'Buzlu kahve, soğuk süt ile',
    inStock: true,
  },
]
const POSPage = () => {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return sampleProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])
  // Calculate totals
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  // Cart functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }
  const clearCart = () => {
    setCart([])
  }
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
  return _jsxs(motion.div, {
    className: 'p-6 min-h-screen bg-dark-900',
    variants: containerVariants,
    initial: 'hidden',
    animate: 'visible',
    children: [
      _jsxs(motion.div, {
        className:
          'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6',
        variants: itemVariants,
        children: [
          _jsxs('div', {
            children: [
              _jsxs('h1', {
                className:
                  'text-3xl font-bold text-white font-display flex items-center gap-3',
                children: [
                  _jsx('div', {
                    className:
                      'w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center',
                    children: _jsx(Zap, {
                      className: 'w-5 h-5 text-primary-400',
                    }),
                  }),
                  'POS Sistemi',
                ],
              }),
              _jsx('p', {
                className: 'text-white/70 mt-1',
                children:
                  'H\u0131zl\u0131 ve kolay sat\u0131\u015F noktas\u0131',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'relative',
            children: [
              _jsx(Search, {
                className:
                  'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400',
              }),
              _jsx('input', {
                type: 'text',
                placeholder: '\u00DCr\u00FCn ara...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className:
                  'pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white/20 transition-all w-64',
              }),
            ],
          }),
        ],
      }),
      _jsxs('div', {
        className:
          'grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[calc(100vh-10rem)]',
        children: [
          _jsxs('div', {
            className: 'lg:col-span-2 space-y-4',
            children: [
              _jsx(motion.div, {
                className: 'glass-card rounded-xl p-4',
                variants: itemVariants,
                children: _jsx(CategoryTabs, {
                  selected: selectedCategory,
                  onChange: setSelectedCategory,
                }),
              }),
              _jsxs(motion.div, {
                className:
                  'glass-card rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-18rem)]',
                variants: itemVariants,
                children: [
                  _jsxs('div', {
                    className: 'flex items-center justify-between mb-4',
                    children: [
                      _jsxs('h2', {
                        className: 'text-lg font-semibold text-white',
                        children: [
                          '\u00DCr\u00FCnler (',
                          filteredProducts.length,
                          ')',
                        ],
                      }),
                      _jsxs('button', {
                        className:
                          'flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-400 hover:text-white transition-colors',
                        children: [
                          _jsx(Filter, { className: 'w-4 h-4' }),
                          'Filtrele',
                        ],
                      }),
                    ],
                  }),
                  _jsx('div', {
                    className:
                      'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4',
                    children: _jsx(AnimatePresence, {
                      mode: 'popLayout',
                      children: filteredProducts.map((product, index) =>
                        _jsx(
                          motion.div,
                          {
                            initial: { opacity: 0, scale: 0.9 },
                            animate: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.9 },
                            transition: { delay: index * 0.05 },
                            children: _jsx(ProductCard, {
                              product: product,
                              onAdd: addToCart,
                            }),
                          },
                          product.id
                        )
                      ),
                    }),
                  }),
                  filteredProducts.length === 0 &&
                    _jsxs('div', {
                      className: 'text-center py-12 text-gray-400',
                      children: [
                        _jsx(Search, {
                          className: 'w-12 h-12 mx-auto mb-4 opacity-50',
                        }),
                        _jsx('p', {
                          children:
                            'Arad\u0131\u011F\u0131n\u0131z kriterlere uygun \u00FCr\u00FCn bulunamad\u0131',
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          _jsxs(motion.div, {
            className: 'glass-card rounded-xl p-6 flex flex-col',
            variants: itemVariants,
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-between mb-4',
                children: [
                  _jsxs('h2', {
                    className:
                      'text-xl font-bold text-white flex items-center gap-2',
                    children: [
                      _jsx(ShoppingCart, { className: 'w-5 h-5' }),
                      'Sepet',
                      itemCount > 0 &&
                        _jsx('span', {
                          className:
                            'bg-primary-500 text-white text-xs px-2 py-1 rounded-full',
                          children: itemCount,
                        }),
                    ],
                  }),
                  cart.length > 0 &&
                    _jsx('button', {
                      onClick: clearCart,
                      className:
                        'text-red-400 hover:text-red-300 text-sm transition-colors',
                      children: 'Temizle',
                    }),
                ],
              }),
              _jsx('div', {
                className: 'flex-1 overflow-y-auto',
                children:
                  cart.length === 0
                    ? _jsxs('div', {
                        className: 'text-center py-12 text-gray-400',
                        children: [
                          _jsx(ShoppingCart, {
                            className: 'w-12 h-12 mx-auto mb-4 opacity-50',
                          }),
                          _jsx('p', { children: 'Sepetiniz bo\u015F' }),
                          _jsx('p', {
                            className: 'text-sm mt-1',
                            children:
                              '\u00DCr\u00FCn eklemek i\u00E7in yukar\u0131daki \u00FCr\u00FCnlere t\u0131klay\u0131n',
                          }),
                        ],
                      })
                    : _jsx(AnimatePresence, {
                        children: cart.map((item, index) =>
                          _jsx(
                            motion.div,
                            {
                              initial: { x: 50, opacity: 0 },
                              animate: { x: 0, opacity: 1 },
                              exit: { x: -50, opacity: 0 },
                              transition: { delay: index * 0.05 },
                              children: _jsx(CartItem, {
                                item: item,
                                onUpdateQuantity: updateQuantity,
                                onRemove: removeFromCart,
                              }),
                            },
                            item.id
                          )
                        ),
                      }),
              }),
              cart.length > 0 &&
                _jsxs('div', {
                  className: 'border-t border-white/10 pt-4 mt-4',
                  children: [
                    _jsx(CartSummary, { cart: cart }),
                    _jsxs(motion.button, {
                      className:
                        'w-full mt-4 py-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      disabled: cart.length === 0,
                      children: ['\u00D6deme (', formatCurrency(total), ')'],
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
    ],
  })
}
export default POSPage
