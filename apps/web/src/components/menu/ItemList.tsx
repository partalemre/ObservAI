import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import {
  useItems,
  useDeleteItem,
  usePatchItem,
  useCategories,
  useGroups,
} from '../../features/menu/hooks'
import { ItemFormDrawer } from './ItemFormDrawer'
import { AssignGroupsDialog } from './AssignGroupsDialog'
import type { MenuItem } from '../../features/menu/types'

interface ItemListProps {
  storeId: string
}

export function ItemList({ storeId }: ItemListProps) {
  const { t } = useTranslation()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)
  const [assigningItem, setAssigningItem] = useState<MenuItem | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const { data: items = [], isLoading } = useItems(storeId)
  const { data: categories = [] } = useCategories(storeId)
  const { data: groups = [] } = useGroups(storeId)
  const patchItem = usePatchItem(storeId)
  const deleteItem = useDeleteItem(storeId)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        !categoryFilter || item.categoryId === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [items, search, categoryFilter])

  const handleToggleActive = (item: MenuItem) => {
    patchItem.mutate({ id: item.id, active: !item.active })
  }

  const handleToggleSoldOut = (item: MenuItem) => {
    patchItem.mutate({ id: item.id, soldOut: !item.soldOut })
  }

  const handleDelete = () => {
    if (deletingItem) {
      deleteItem.mutate(deletingItem.id)
      setDeletingItem(null)
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const getGroupNames = (groupIds: string[] = []) => {
    return groupIds
      .map((id) => groups.find((g) => g.id === id)?.name)
      .filter(Boolean)
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading items...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4">
        <div className="min-w-64 flex-1">
          <input
            type="text"
            placeholder={t('menu.common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
          />
        </div>
        <div className="min-w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          <p>
            {items.length === 0
              ? t('menu.items.empty')
              : 'No items match your filters'}
          </p>
          {items.length === 0 && (
            <Button onClick={() => setShowCreateForm(true)} className="mt-4">
              {t('menu.actions.newItem')}
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.photo')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.price')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.category')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.active')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.soldOut')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {t('menu.common.groups')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                          📷
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        {item.sku && (
                          <p className="text-sm text-slate-500">
                            SKU: {item.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-900">${item.price}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleToggleActive(item)}
                        className="text-primary focus:ring-primary rounded border-slate-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.soldOut}
                        onChange={() => handleToggleSoldOut(item)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-600">
                        {getGroupNames(item.modifierGroupIds).length > 0 ? (
                          <span>
                            {getGroupNames(item.modifierGroupIds).length} groups
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAssigningItem(item)}
                        >
                          {t('menu.actions.assignGroups')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          {t('menu.actions.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms and Dialogs */}
      {(showCreateForm || editingItem) && (
        <ItemFormDrawer
          storeId={storeId}
          item={editingItem || undefined}
          onClose={() => {
            setShowCreateForm(false)
            setEditingItem(null)
          }}
        />
      )}

      {assigningItem && (
        <AssignGroupsDialog
          storeId={storeId}
          item={assigningItem}
          onClose={() => setAssigningItem(null)}
        />
      )}

      {deletingItem && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p>{t('menu.confirm.deleteItem')}</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setDeletingItem(null)}>
                {t('menu.actions.cancel')}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteItem.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('menu.actions.delete')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
