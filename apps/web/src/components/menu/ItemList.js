import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useMemo } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { t } from '../../lib/i18n'
import {
  useItems,
  useDeleteItem,
  usePatchItem,
  useCategories,
  useGroups,
} from '../../features/menu/hooks'
import { ItemFormDrawer } from './ItemFormDrawer'
import { AssignGroupsDialog } from './AssignGroupsDialog'
export function ItemList({ storeId }) {
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [assigningItem, setAssigningItem] = useState(null)
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
  const handleToggleActive = (item) => {
    patchItem.mutate({ id: item.id, active: !item.active })
  }
  const handleToggleSoldOut = (item) => {
    patchItem.mutate({ id: item.id, soldOut: !item.soldOut })
  }
  const handleDelete = () => {
    if (deletingItem) {
      deleteItem.mutate(deletingItem.id)
      setDeletingItem(null)
    }
  }
  const getCategoryName = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }
  const getGroupNames = (groupIds = []) => {
    return groupIds
      .map((id) => groups.find((g) => g.id === id)?.name)
      .filter(Boolean)
  }
  if (isLoading) {
    return _jsx('div', {
      className: 'animate-pulse',
      children: 'Loading items...',
    })
  }
  return _jsxs('div', {
    className: 'space-y-4',
    children: [
      _jsxs('div', {
        className: 'flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4',
        children: [
          _jsx('div', {
            className: 'min-w-64 flex-1',
            children: _jsx('input', {
              type: 'text',
              placeholder: t('menu.common.search'),
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className:
                'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
            }),
          }),
          _jsx('div', {
            className: 'min-w-48',
            children: _jsxs('select', {
              value: categoryFilter,
              onChange: (e) => setCategoryFilter(e.target.value),
              className:
                'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
              children: [
                _jsx('option', { value: '', children: 'All categories' }),
                categories.map((category) =>
                  _jsx(
                    'option',
                    { value: category.id, children: category.name },
                    category.id
                  )
                ),
              ],
            }),
          }),
        ],
      }),
      filteredItems.length === 0
        ? _jsxs('div', {
            className: 'py-8 text-center text-slate-500',
            children: [
              _jsx('p', {
                children:
                  items.length === 0
                    ? t('menu.items.empty')
                    : 'No items match your filters',
              }),
              items.length === 0 &&
                _jsx(Button, {
                  onClick: () => setShowCreateForm(true),
                  className: 'mt-4',
                  children: t('menu.actions.newItem'),
                }),
            ],
          })
        : _jsx('div', {
            className:
              'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm',
            children: _jsx('div', {
              className: 'overflow-x-auto',
              children: _jsxs('table', {
                className: 'w-full',
                children: [
                  _jsx('thead', {
                    className: 'border-b border-slate-200 bg-slate-50',
                    children: _jsxs('tr', {
                      children: [
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.photo'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: 'Name',
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.price'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.category'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.active'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.soldOut'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: t('menu.common.groups'),
                        }),
                        _jsx('th', {
                          className:
                            'px-4 py-3 text-left text-sm font-medium text-slate-700',
                          children: 'Actions',
                        }),
                      ],
                    }),
                  }),
                  _jsx('tbody', {
                    className: 'divide-y divide-slate-200',
                    children: filteredItems.map((item) =>
                      _jsxs(
                        'tr',
                        {
                          className: 'hover:bg-slate-50',
                          children: [
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: item.imageUrl
                                ? _jsx('img', {
                                    src: item.imageUrl,
                                    alt: item.name,
                                    className:
                                      'h-12 w-12 rounded-lg object-cover',
                                  })
                                : _jsx('div', {
                                    className:
                                      'flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-slate-400',
                                    children: '\uD83D\uDCF7',
                                  }),
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: _jsxs('div', {
                                children: [
                                  _jsx('p', {
                                    className: 'font-medium text-slate-900',
                                    children: item.name,
                                  }),
                                  item.sku &&
                                    _jsxs('p', {
                                      className: 'text-sm text-slate-500',
                                      children: ['SKU: ', item.sku],
                                    }),
                                ],
                              }),
                            }),
                            _jsxs('td', {
                              className: 'px-4 py-3 text-slate-900',
                              children: ['$', item.price],
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3 text-slate-700',
                              children: getCategoryName(item.categoryId),
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: _jsx('input', {
                                type: 'checkbox',
                                checked: item.active,
                                onChange: () => handleToggleActive(item),
                                className:
                                  'text-primary focus:ring-primary rounded border-slate-300',
                              }),
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: _jsx('input', {
                                type: 'checkbox',
                                checked: item.soldOut,
                                onChange: () => handleToggleSoldOut(item),
                                className:
                                  'rounded border-slate-300 text-red-600 focus:ring-red-600',
                              }),
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: _jsx('div', {
                                className: 'text-sm text-slate-600',
                                children:
                                  getGroupNames(item.modifierGroupIds).length >
                                  0
                                    ? _jsxs('span', {
                                        children: [
                                          getGroupNames(item.modifierGroupIds)
                                            .length,
                                          ' groups',
                                        ],
                                      })
                                    : _jsx('span', {
                                        className: 'text-slate-400',
                                        children: 'None',
                                      }),
                              }),
                            }),
                            _jsx('td', {
                              className: 'px-4 py-3',
                              children: _jsxs('div', {
                                className: 'flex space-x-2',
                                children: [
                                  _jsx(Button, {
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => setEditingItem(item),
                                    children: 'Edit',
                                  }),
                                  _jsx(Button, {
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => setAssigningItem(item),
                                    children: t('menu.actions.assignGroups'),
                                  }),
                                  _jsx(Button, {
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => setDeletingItem(item),
                                    className:
                                      'text-red-600 hover:text-red-700',
                                    children: t('menu.actions.delete'),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        },
                        item.id
                      )
                    ),
                  }),
                ],
              }),
            }),
          }),
      (showCreateForm || editingItem) &&
        _jsx(ItemFormDrawer, {
          storeId: storeId,
          item: editingItem || undefined,
          onClose: () => {
            setShowCreateForm(false)
            setEditingItem(null)
          },
        }),
      assigningItem &&
        _jsx(AssignGroupsDialog, {
          storeId: storeId,
          item: assigningItem,
          onClose: () => setAssigningItem(null),
        }),
      deletingItem &&
        _jsx(Modal, {
          isOpen: true,
          onClose: () => setDeletingItem(null),
          title: 'Confirm Delete',
          children: _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx('p', { children: t('menu.confirm.deleteItem') }),
              _jsxs('div', {
                className: 'flex justify-end space-x-3',
                children: [
                  _jsx(Button, {
                    variant: 'ghost',
                    onClick: () => setDeletingItem(null),
                    children: t('menu.actions.cancel'),
                  }),
                  _jsx(Button, {
                    onClick: handleDelete,
                    disabled: deleteItem.isPending,
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
