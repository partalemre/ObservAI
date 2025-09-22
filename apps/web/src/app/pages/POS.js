import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo, useEffect } from 'react'
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
export const POS = () => {
  const { selectedStoreId } = useOrgStore()
  const { addItem, clear } = usePOS()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false)
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
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
  const handleProductClick = (item) => {
    if (item.modifierGroupIds && item.modifierGroupIds.length > 0) {
      // Open modifier dialog
      setSelectedItem(item)
      setModifierDialogOpen(true)
    } else {
      // Add directly to cart
      addItem(item)
    }
  }
  const handleAddToCart = (item, qty, modifiers) => {
    addItem(item, qty, modifiers)
    setModifierDialogOpen(false)
    setSelectedItem(null)
  }
  const isLoading = categoriesLoading || itemsLoading || modifierGroupsLoading
  if (!selectedStoreId) {
    return _jsx('div', {
      className: 'p-6',
      children: _jsx(EmptyState, {
        title: 'No Store Selected',
        description: 'Please select a store to use the POS system',
      }),
    })
  }
  return _jsxs('div', {
    className: 'flex h-full',
    children: [
      _jsxs('div', {
        className: 'flex min-w-0 flex-1 flex-col',
        children: [
          _jsxs('div', {
            className: 'border-b p-6',
            children: [
              _jsx('h1', {
                className: 'mb-4 text-2xl font-bold text-gray-900',
                children: t('pos.title'),
              }),
              _jsx(SearchBar, {
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: t('pos.searchPlaceholder'),
                className: 'mb-4',
              }),
              !categoriesLoading &&
                _jsx(CategoryTabs, {
                  categories: categories,
                  activeCategory: activeCategory,
                  onCategoryChange: setActiveCategory,
                  allLabel: t('pos.all'),
                }),
            ],
          }),
          _jsx('div', {
            className: 'flex-1 overflow-y-auto p-6',
            children: isLoading
              ? _jsx('div', {
                  className:
                    'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                  children: Array.from({ length: 8 }).map((_, i) =>
                    _jsxs(
                      'div',
                      {
                        className: 'rounded-xl border border-gray-200 p-4',
                        children: [
                          _jsx(Skeleton, {
                            className: 'mb-3 h-32 w-full rounded-lg',
                          }),
                          _jsx(Skeleton, { className: 'mb-2 h-4 w-3/4' }),
                          _jsx(Skeleton, { className: 'h-5 w-1/2' }),
                        ],
                      },
                      i
                    )
                  ),
                })
              : filteredItems.length === 0
                ? _jsx(EmptyState, {
                    title: searchQuery
                      ? 'No products found'
                      : t('pos.emptyCatalog'),
                    description: searchQuery
                      ? `No products match "${searchQuery}"`
                      : 'Add products to your catalog to get started',
                  })
                : _jsx('div', {
                    className:
                      'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                    children: filteredItems.map((item) =>
                      _jsx(
                        ProductCard,
                        { item: item, onClick: handleProductClick },
                        item.id
                      )
                    ),
                  }),
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex w-80 flex-col border-l bg-gray-50',
        children: _jsx('div', {
          className: 'flex-1 overflow-y-auto p-6',
          children: _jsx(Cart, {
            onCheckout: () => setCheckoutDialogOpen(true),
          }),
        }),
      }),
      selectedItem &&
        _jsx(ModifierDialog, {
          open: modifierDialogOpen,
          onClose: () => {
            setModifierDialogOpen(false)
            setSelectedItem(null)
          },
          item: selectedItem,
          modifierGroups: modifierGroups,
          onAddToCart: handleAddToCart,
        }),
      _jsx(CheckoutDialog, {
        open: checkoutDialogOpen,
        onClose: () => setCheckoutDialogOpen(false),
      }),
    ],
  })
}
