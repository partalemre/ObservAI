import React, { useState, useMemo } from 'react'
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

const POSPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([])
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
  const addToCart = (product: any) => {
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

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (id: string) => {
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

  return (
    <motion.div
      className="bg-dark-900 min-h-screen p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="font-display flex items-center gap-3 text-3xl font-bold text-white">
            <div className="bg-primary-500/20 flex h-10 w-10 items-center justify-center rounded-xl">
              <Zap className="text-primary-400 h-5 w-5" />
            </div>
            POS Sistemi
          </h1>
          <p className="mt-1 text-white/70">Hızlı ve kolay satış noktası</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:border-primary-500 w-64 rounded-lg border border-white/20 bg-white/10 py-2 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:bg-white/20 focus:outline-none"
          />
        </div>
      </motion.div>

      <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Products Grid - 2 columns */}
        <div className="space-y-4 lg:col-span-2">
          {/* Category Tabs */}
          <motion.div
            className="glass-card rounded-xl p-4"
            variants={itemVariants}
          >
            <CategoryTabs
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </motion.div>

          {/* Products */}
          <motion.div
            className="glass-card max-h-[calc(100vh-18rem)] overflow-y-auto rounded-xl p-6"
            variants={itemVariants}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Ürünler ({filteredProducts.length})
              </h2>
              <button className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/20 hover:text-white">
                <Filter className="h-4 w-4" />
                Filtrele
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} onAdd={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Aradığınız kriterlere uygun ürün bulunamadı</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Cart - 1 column */}
        <motion.div
          className="glass-card flex flex-col rounded-xl p-6"
          variants={itemVariants}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <ShoppingCart className="h-5 w-5" />
              Sepet
              {itemCount > 0 && (
                <span className="bg-primary-500 rounded-full px-2 py-1 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </h2>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-400 transition-colors hover:text-red-300"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Sepetiniz boş</p>
                <p className="mt-1 text-sm">
                  Ürün eklemek için yukarıdaki ürünlere tıklayın
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <CartSummary cart={cart} />
              <motion.button
                className="from-primary-500 hover:shadow-primary-500/25 mt-4 w-full rounded-lg bg-gradient-to-r to-purple-500 py-3 font-medium text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={cart.length === 0}
              >
                Ödeme ({formatCurrency(total)})
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default POSPage
