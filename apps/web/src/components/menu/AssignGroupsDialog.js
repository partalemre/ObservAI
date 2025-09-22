import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useGroups, usePatchItem } from '../../features/menu/hooks'
export function AssignGroupsDialog({ storeId, item, onClose }) {
  const [selectedGroupIds, setSelectedGroupIds] = useState(
    item.modifierGroupIds || []
  )
  const { data: groups = [] } = useGroups(storeId)
  const patchItem = usePatchItem(storeId)
  const handleToggleGroup = (groupId) => {
    setSelectedGroupIds((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId)
      } else {
        return [...prev, groupId]
      }
    })
  }
  const handleMoveUp = (groupId) => {
    const currentIndex = selectedGroupIds.indexOf(groupId)
    if (currentIndex > 0) {
      const newOrder = [...selectedGroupIds]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex - 1, 0, item)
      setSelectedGroupIds(newOrder)
    }
  }
  const handleMoveDown = (groupId) => {
    const currentIndex = selectedGroupIds.indexOf(groupId)
    if (currentIndex < selectedGroupIds.length - 1) {
      const newOrder = [...selectedGroupIds]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex + 1, 0, item)
      setSelectedGroupIds(newOrder)
    }
  }
  const handleSave = () => {
    patchItem.mutate(
      {
        id: item.id,
        modifierGroupIds: selectedGroupIds,
      },
      {
        onSuccess: onClose,
      }
    )
  }
  const selectedGroups = selectedGroupIds
    .map((id) => groups.find((g) => g.id === id))
    .filter(Boolean)
  const availableGroups = groups.filter((g) => !selectedGroupIds.includes(g.id))
  return _jsx(Modal, {
    isOpen: true,
    onClose: onClose,
    title: t('menu.assign.title'),
    className: 'max-w-2xl',
    children: _jsxs('div', {
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          className: 'text-sm text-slate-600',
          children: [
            'Assigning modifier groups to: ',
            _jsx('strong', { children: item.name }),
          ],
        }),
        _jsxs('div', {
          className: 'grid grid-cols-1 gap-6 md:grid-cols-2',
          children: [
            _jsxs('div', {
              children: [
                _jsx('h3', {
                  className: 'mb-3 text-sm font-medium text-slate-700',
                  children: 'Available Groups',
                }),
                _jsx('div', {
                  className: 'max-h-64 space-y-2 overflow-y-auto',
                  children:
                    availableGroups.length === 0
                      ? _jsx('p', {
                          className: 'text-sm text-slate-500 italic',
                          children: 'All groups assigned',
                        })
                      : availableGroups.map((group) =>
                          _jsxs(
                            'div',
                            {
                              className:
                                'flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50',
                              onClick: () => handleToggleGroup(group.id),
                              children: [
                                _jsxs('div', {
                                  children: [
                                    _jsx('p', {
                                      className: 'font-medium text-slate-900',
                                      children: group.name,
                                    }),
                                    _jsxs('p', {
                                      className: 'text-xs text-slate-500',
                                      children: [
                                        'Min: ',
                                        group.min,
                                        ', Max: ',
                                        group.max,
                                        ',',
                                        ' ',
                                        group.options.length,
                                        ' options',
                                      ],
                                    }),
                                  ],
                                }),
                                _jsx(Button, {
                                  variant: 'ghost',
                                  size: 'sm',
                                  onClick: (e) => {
                                    e.stopPropagation()
                                    handleToggleGroup(group.id)
                                  },
                                  children: 'Add',
                                }),
                              ],
                            },
                            group.id
                          )
                        ),
                }),
              ],
            }),
            _jsxs('div', {
              children: [
                _jsx('h3', {
                  className: 'mb-3 text-sm font-medium text-slate-700',
                  children: 'Selected Groups',
                }),
                _jsx('div', {
                  className: 'max-h-64 space-y-2 overflow-y-auto',
                  children:
                    selectedGroups.length === 0
                      ? _jsx('p', {
                          className: 'text-sm text-slate-500 italic',
                          children: 'No groups selected',
                        })
                      : selectedGroups.map((group, index) =>
                          _jsxs(
                            'div',
                            {
                              className:
                                'bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border border-slate-200 p-3',
                              children: [
                                _jsxs('div', {
                                  className: 'flex-1',
                                  children: [
                                    _jsx('p', {
                                      className: 'font-medium text-slate-900',
                                      children: group.name,
                                    }),
                                    _jsxs('p', {
                                      className: 'text-xs text-slate-500',
                                      children: [
                                        'Min: ',
                                        group.min,
                                        ', Max: ',
                                        group.max,
                                        ',',
                                        ' ',
                                        group.options.length,
                                        ' options',
                                      ],
                                    }),
                                  ],
                                }),
                                _jsxs('div', {
                                  className: 'flex items-center space-x-1',
                                  children: [
                                    _jsx(Button, {
                                      variant: 'ghost',
                                      size: 'sm',
                                      onClick: () => handleMoveUp(group.id),
                                      disabled: index === 0,
                                      className: 'h-6 w-6 p-0',
                                      children: '\u2191',
                                    }),
                                    _jsx(Button, {
                                      variant: 'ghost',
                                      size: 'sm',
                                      onClick: () => handleMoveDown(group.id),
                                      disabled:
                                        index === selectedGroups.length - 1,
                                      className: 'h-6 w-6 p-0',
                                      children: '\u2193',
                                    }),
                                    _jsx(Button, {
                                      variant: 'ghost',
                                      size: 'sm',
                                      onClick: () =>
                                        handleToggleGroup(group.id),
                                      className:
                                        'text-red-600 hover:text-red-700',
                                      children: '\u2715',
                                    }),
                                  ],
                                }),
                              ],
                            },
                            group.id
                          )
                        ),
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className:
            'flex justify-end space-x-3 border-t border-slate-200 pt-4',
          children: [
            _jsx(Button, {
              variant: 'ghost',
              onClick: onClose,
              disabled: patchItem.isPending,
              children: t('menu.actions.cancel'),
            }),
            _jsx(Button, {
              onClick: handleSave,
              disabled: patchItem.isPending,
              children: patchItem.isPending
                ? 'Saving...'
                : t('menu.assign.save'),
            }),
          ],
        }),
      ],
    }),
  })
}
