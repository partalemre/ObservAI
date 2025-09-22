import React, { useState, useMemo, useEffect } from 'react'
import { t } from '../../lib/i18n'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui'
import { SearchBar } from '../../components/pos/SearchBar'
import { CategoryTabs } from '../../components/pos/CategoryTabs'
import { ProductCard } from '../../components/pos/ProductCard'
import { Cart } from '../../components/pos/Cart'
import { ModifierDialog } from '../../components/pos/ModifierDialog'
import { CheckoutDialog } from '../../components/pos/CheckoutDialog'
import {
  useCategories,
  useItems,
  useModifierGroups,
} from '../../features/pos/hooks'
import { usePOS } from '../../store/posStore'
import { useOrgStore } from '../../store/orgStore'
import type { Item } from '../../features/pos/types'

export const POS: React.FC = () => {
  const { selectedStoreId } = useOrgStore()
  const { addItem, clear } = usePOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  // Data fetching
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(
    selectedStoreId || ''
  )
  const { data: items = [], isLoading: itemsLoading } = useItems(
    selectedStoreId || ''
  )
  const { data: modifierGroups = [], isLoading: modifierGroupsLoading } =
    useModifierGroups(selectedStoreId || '')

  // Clear cart when store changes (safety)
  useEffect(() => {
    clear()
  }, [selectedStoreId, clear])

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let filtered = items

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((item) => item.categoryId === activeCategory)
    }

    return filtered
  }, [items, searchQuery, activeCategory])

  const handleProductClick = (item: Item) => {
    if (item.modifierGroupIds && item.modifierGroupIds.length > 0) {
      // Open modifier dialog
      setSelectedItem(item)
      setModifierDialogOpen(true)
    } else {
      // Add directly to cart
      addItem(item)
    }
  }

  const handleAddToCart = (item: Item, qty: number, modifiers: any[]) => {
    addItem(item, qty, modifiers)
    setModifierDialogOpen(false)
    setSelectedItem(null)
  }

  const isLoading = categoriesLoading || itemsLoading || modifierGroupsLoading

  if (!selectedStoreId) {
    return (
      <div className="p-6">
        <EmptyState
          title="No Store Selected"
          description="Please select a store to use the POS system"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b p-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {t('pos.title')}
          </h1>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('pos.searchPlaceholder')}
            className="mb-4"
          />

          {/* Category Tabs */}
          {!categoriesLoading && (
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              allLabel={t('pos.all')}
            />
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <Skeleton className="mb-3 h-32 w-full rounded-lg" />
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No products found' : t('pos.emptyCatalog')}
              description={
                searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'Add products to your catalog to get started'
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="flex w-80 flex-col border-l bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6">
          <Cart onCheckout={() => setCheckoutDialogOpen(true)} />
        </div>
      </div>

      {/* Modals */}
      {selectedItem && (
        <ModifierDialog
          open={modifierDialogOpen}
          onClose={() => {
            setModifierDialogOpen(false)
            setSelectedItem(null)
          }}
          item={selectedItem}
          modifierGroups={modifierGroups}
          onAddToCart={handleAddToCart}
        />
      )}

      <CheckoutDialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
      />
    </div>
  )
}
