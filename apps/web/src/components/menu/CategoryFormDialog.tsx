import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useCreateCategory, usePatchCategory } from '../../features/menu/hooks'
import type { MenuCategory } from '../../features/menu/types'

interface CategoryFormDialogProps {
  storeId: string
  category?: MenuCategory
  onClose: () => void
}

export function CategoryFormDialog({
  storeId,
  category,
  onClose,
}: CategoryFormDialogProps) {
  const [name, setName] = useState(category?.name || '')
  const [active, setActive] = useState(category?.active ?? true)

  const createCategory = useCreateCategory(storeId)
  const patchCategory = usePatchCategory(storeId)

  const isEditing = !!category
  const mutation = isEditing ? patchCategory : createCategory

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (isEditing) {
      patchCategory.mutate(
        { id: category.id, name: name.trim(), active },
        { onSuccess: onClose }
      )
    } else {
      createCategory.mutate(
        { storeId, name: name.trim() },
        { onSuccess: onClose }
      )
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'New Category'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {t('menu.categories.name')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Enter category name"
            required
          />
        </div>

        {isEditing && (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="text-primary focus:ring-primary rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">
                {t('menu.common.active')}
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {t('menu.actions.cancel')}
          </Button>
          <Button type="submit" disabled={!name.trim() || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : t('menu.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
