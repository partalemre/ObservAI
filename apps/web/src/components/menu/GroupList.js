import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { t } from '../../lib/i18n'
import { useGroups, useDeleteGroup } from '../../features/menu/hooks'
import { GroupFormDialog } from './GroupFormDialog'
export function GroupList({ storeId }) {
  const [editingGroup, setEditingGroup] = useState(null)
  const [deletingGroup, setDeletingGroup] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: groups = [], isLoading } = useGroups(storeId)
  const deleteGroup = useDeleteGroup(storeId)
  const handleDelete = () => {
    if (deletingGroup) {
      deleteGroup.mutate(deletingGroup.id)
      setDeletingGroup(null)
    }
  }
  if (isLoading) {
    return _jsx('div', {
      className: 'animate-pulse',
      children: 'Loading modifier groups...',
    })
  }
  if (groups.length === 0) {
    return _jsxs('div', {
      className: 'py-8 text-center text-slate-500',
      children: [
        _jsx('p', { children: t('menu.groups.empty') }),
        _jsx(Button, {
          onClick: () => setShowCreateForm(true),
          className: 'mt-4',
          children: t('menu.actions.newGroup'),
        }),
        showCreateForm &&
          _jsx(GroupFormDialog, {
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
                      children: t('menu.groups.name'),
                    }),
                    _jsx('th', {
                      className:
                        'px-4 py-3 text-left text-sm font-medium text-slate-700',
                      children: t('menu.groups.min'),
                    }),
                    _jsx('th', {
                      className:
                        'px-4 py-3 text-left text-sm font-medium text-slate-700',
                      children: t('menu.groups.max'),
                    }),
                    _jsx('th', {
                      className:
                        'px-4 py-3 text-left text-sm font-medium text-slate-700',
                      children: t('menu.groups.options'),
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
                children: groups.map((group) =>
                  _jsxs(
                    'tr',
                    {
                      className: 'hover:bg-slate-50',
                      children: [
                        _jsx('td', {
                          className: 'px-4 py-3',
                          children: _jsx('p', {
                            className: 'font-medium text-slate-900',
                            children: group.name,
                          }),
                        }),
                        _jsx('td', {
                          className: 'px-4 py-3 text-slate-700',
                          children: group.min,
                        }),
                        _jsx('td', {
                          className: 'px-4 py-3 text-slate-700',
                          children: group.max,
                        }),
                        _jsxs('td', {
                          className: 'px-4 py-3 text-slate-700',
                          children: [
                            group.options.length,
                            ' ',
                            group.options.length === 1 ? 'option' : 'options',
                          ],
                        }),
                        _jsx('td', {
                          className: 'px-4 py-3',
                          children: _jsxs('div', {
                            className: 'flex space-x-2',
                            children: [
                              _jsx(Button, {
                                variant: 'ghost',
                                size: 'sm',
                                onClick: () => setEditingGroup(group),
                                children: 'Edit',
                              }),
                              _jsx(Button, {
                                variant: 'ghost',
                                size: 'sm',
                                onClick: () => setDeletingGroup(group),
                                className: 'text-red-600 hover:text-red-700',
                                children: t('menu.actions.delete'),
                              }),
                            ],
                          }),
                        }),
                      ],
                    },
                    group.id
                  )
                ),
              }),
            ],
          }),
        }),
      }),
      editingGroup &&
        _jsx(GroupFormDialog, {
          storeId: storeId,
          group: editingGroup,
          onClose: () => setEditingGroup(null),
        }),
      deletingGroup &&
        _jsx(Modal, {
          isOpen: true,
          onClose: () => setDeletingGroup(null),
          title: 'Confirm Delete',
          children: _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx('p', { children: t('menu.confirm.deleteGroup') }),
              _jsxs('div', {
                className: 'flex justify-end space-x-3',
                children: [
                  _jsx(Button, {
                    variant: 'ghost',
                    onClick: () => setDeletingGroup(null),
                    children: t('menu.actions.cancel'),
                  }),
                  _jsx(Button, {
                    onClick: handleDelete,
                    disabled: deleteGroup.isPending,
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
