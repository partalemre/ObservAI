import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import {
  useCategories,
  useDeleteCategory,
  usePatchCategory,
  useReorderCategories,
} from '../../features/menu/hooks'
import { CategoryFormDialog } from './CategoryFormDialog'
import type { MenuCategory } from '../../features/menu/types'

interface CategoryListProps {
  storeId: string
}

export function CategoryList({ storeId }: CategoryListProps) {
  const { t } = useTranslation()
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  )
  const [deletingCategory, setDeletingCategory] = useState<MenuCategory | null>(
    null
  )
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: categories = [], isLoading } = useCategories(storeId)
  const patchCategory = usePatchCategory(storeId)
  const deleteCategory = useDeleteCategory(storeId)
  const reorderCategories = useReorderCategories(storeId)

  const handleMoveUp = (category: MenuCategory) => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex > 0) {
      const newOrder = [...categories]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex - 1, 0, item)

      const orderIds = newOrder.map((c) => c.id)
      reorderCategories.mutate({ storeId, order: orderIds })
    }
  }

  const handleMoveDown = (category: MenuCategory) => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex < categories.length - 1) {
      const newOrder = [...categories]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex + 1, 0, item)

      const orderIds = newOrder.map((c) => c.id)
      reorderCategories.mutate({ storeId, order: orderIds })
    }
  }

  const handleToggleActive = (category: MenuCategory) => {
    patchCategory.mutate({ id: category.id, active: !category.active })
  }

  const handleDelete = () => {
    if (deletingCategory) {
      deleteCategory.mutate(deletingCategory.id)
      setDeletingCategory(null)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading categories...</div>
  }

  if (categories.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p>{t('menu.categories.empty')}</p>
        <Button onClick={() => setShowCreateForm(true)} className="mt-4">
          {t('menu.actions.newCategory')}
        </Button>
        {showCreateForm && (
          <CategoryFormDialog
            storeId={storeId}
            onClose={() => setShowCreateForm(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(category)}
                    disabled={index === 0 || reorderCategories.isPending}
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(category)}
                    disabled={
                      index === categories.length - 1 ||
                      reorderCategories.isPending
                    }
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Sort: {category.sort}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={category.active}
                    onChange={() => handleToggleActive(category)}
                    className="text-primary focus:ring-primary rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">
                    {t('menu.common.active')}
                  </span>
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingCategory(category)}
                  className="text-red-600 hover:text-red-700"
                >
                  {t('menu.actions.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingCategory && (
        <CategoryFormDialog
          storeId={storeId}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {deletingCategory && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingCategory(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p>{t('menu.confirm.deleteCategory')}</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setDeletingCategory(null)}>
                {t('menu.actions.cancel')}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
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
