import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useCreateCategory, usePatchCategory } from '../../features/menu/hooks'
export function CategoryFormDialog({ storeId, category, onClose }) {
  const [name, setName] = useState(category?.name || '')
  const [active, setActive] = useState(category?.active ?? true)
  const createCategory = useCreateCategory(storeId)
  const patchCategory = usePatchCategory(storeId)
  const isEditing = !!category
  const mutation = isEditing ? patchCategory : createCategory
  const handleSubmit = (e) => {
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
  return _jsx(Modal, {
    isOpen: true,
    onClose: onClose,
    title: isEditing ? 'Edit Category' : 'New Category',
    children: _jsxs('form', {
      onSubmit: handleSubmit,
      className: 'space-y-4',
      children: [
        _jsxs('div', {
          children: [
            _jsx('label', {
              htmlFor: 'name',
              className: 'mb-1 block text-sm font-medium text-slate-700',
              children: t('menu.categories.name'),
            }),
            _jsx('input', {
              id: 'name',
              type: 'text',
              value: name,
              onChange: (e) => setName(e.target.value),
              className:
                'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
              placeholder: 'Enter category name',
              required: true,
            }),
          ],
        }),
        isEditing &&
          _jsx('div', {
            children: _jsxs('label', {
              className: 'flex items-center space-x-2',
              children: [
                _jsx('input', {
                  type: 'checkbox',
                  checked: active,
                  onChange: (e) => setActive(e.target.checked),
                  className:
                    'text-primary focus:ring-primary rounded border-slate-300',
                }),
                _jsx('span', {
                  className: 'text-sm text-slate-700',
                  children: t('menu.common.active'),
                }),
              ],
            }),
          }),
        _jsxs('div', {
          className: 'flex justify-end space-x-3 pt-4',
          children: [
            _jsx(Button, {
              type: 'button',
              variant: 'ghost',
              onClick: onClose,
              disabled: mutation.isPending,
              children: t('menu.actions.cancel'),
            }),
            _jsx(Button, {
              type: 'submit',
              disabled: !name.trim() || mutation.isPending,
              children: mutation.isPending
                ? 'Saving...'
                : t('menu.actions.save'),
            }),
          ],
        }),
      ],
    }),
  })
}
