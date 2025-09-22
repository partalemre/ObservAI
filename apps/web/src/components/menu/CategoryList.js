import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { t } from '../../lib/i18n'
import {
  useCategories,
  useDeleteCategory,
  usePatchCategory,
  useReorderCategories,
} from '../../features/menu/hooks'
import { CategoryFormDialog } from './CategoryFormDialog'
export function CategoryList({ storeId }) {
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: categories = [], isLoading } = useCategories(storeId)
  const patchCategory = usePatchCategory(storeId)
  const deleteCategory = useDeleteCategory(storeId)
  const reorderCategories = useReorderCategories(storeId)
  const handleMoveUp = (category) => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex > 0) {
      const newOrder = [...categories]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex - 1, 0, item)
      const orderIds = newOrder.map((c) => c.id)
      reorderCategories.mutate({ storeId, order: orderIds })
    }
  }
  const handleMoveDown = (category) => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex < categories.length - 1) {
      const newOrder = [...categories]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex + 1, 0, item)
      const orderIds = newOrder.map((c) => c.id)
      reorderCategories.mutate({ storeId, order: orderIds })
    }
  }
  const handleToggleActive = (category) => {
    patchCategory.mutate({ id: category.id, active: !category.active })
  }
  const handleDelete = () => {
    if (deletingCategory) {
      deleteCategory.mutate(deletingCategory.id)
      setDeletingCategory(null)
    }
  }
  if (isLoading) {
    return _jsx('div', {
      className: 'animate-pulse',
      children: 'Loading categories...',
    })
  }
  if (categories.length === 0) {
    return _jsxs('div', {
      className: 'py-8 text-center text-slate-500',
      children: [
        _jsx('p', { children: t('menu.categories.empty') }),
        _jsx(Button, {
          onClick: () => setShowCreateForm(true),
          className: 'mt-4',
          children: t('menu.actions.newCategory'),
        }),
        showCreateForm &&
          _jsx(CategoryFormDialog, {
            storeId: storeId,
            onClose: () => setShowCreateForm(false),
          }),
      ],
    })
  }
  return _jsxs('div', {
    className: 'space-y-4',
    children: [
      _jsx('div', {
        className: 'rounded-lg border border-slate-200 bg-white shadow-sm',
        children: _jsx('div', {
          className: 'divide-y divide-slate-200',
          children: categories.map((category, index) =>
            _jsxs(
              'div',
              {
                className: 'flex items-center justify-between p-4',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center space-x-4',
                    children: [
                      _jsxs('div', {
                        className: 'flex flex-col space-y-1',
                        children: [
                          _jsx(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: () => handleMoveUp(category),
                            disabled:
                              index === 0 || reorderCategories.isPending,
                            className: 'h-6 w-6 p-0',
                            children: '\u2191',
                          }),
                          _jsx(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: () => handleMoveDown(category),
                            disabled:
                              index === categories.length - 1 ||
                              reorderCategories.isPending,
                            className: 'h-6 w-6 p-0',
                            children: '\u2193',
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('h3', {
                            className: 'font-medium text-slate-900',
                            children: category.name,
                          }),
                          _jsxs('p', {
                            className: 'text-sm text-slate-500',
                            children: ['Sort: ', category.sort],
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'flex items-center space-x-3',
                    children: [
                      _jsxs('label', {
                        className: 'flex items-center space-x-2',
                        children: [
                          _jsx('input', {
                            type: 'checkbox',
                            checked: category.active,
                            onChange: () => handleToggleActive(category),
                            className:
                              'text-primary focus:ring-primary rounded border-slate-300',
                          }),
                          _jsx('span', {
                            className: 'text-sm text-slate-700',
                            children: t('menu.common.active'),
                          }),
                        ],
                      }),
                      _jsx(Button, {
                        variant: 'ghost',
                        size: 'sm',
                        onClick: () => setEditingCategory(category),
                        children: 'Edit',
                      }),
                      _jsx(Button, {
                        variant: 'ghost',
                        size: 'sm',
                        onClick: () => setDeletingCategory(category),
                        className: 'text-red-600 hover:text-red-700',
                        children: t('menu.actions.delete'),
                      }),
                    ],
                  }),
                ],
              },
              category.id
            )
          ),
        }),
      }),
      editingCategory &&
        _jsx(CategoryFormDialog, {
          storeId: storeId,
          category: editingCategory,
          onClose: () => setEditingCategory(null),
        }),
      deletingCategory &&
        _jsx(Modal, {
          isOpen: true,
          onClose: () => setDeletingCategory(null),
          title: 'Confirm Delete',
          children: _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx('p', { children: t('menu.confirm.deleteCategory') }),
              _jsxs('div', {
                className: 'flex justify-end space-x-3',
                children: [
                  _jsx(Button, {
                    variant: 'ghost',
                    onClick: () => setDeletingCategory(null),
                    children: t('menu.actions.cancel'),
                  }),
                  _jsx(Button, {
                    onClick: handleDelete,
                    disabled: deleteCategory.isPending,
                    className: 'bg-red-600 hover:bg-red-700',
                    children: t('menu.actions.delete'),
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  })
}
