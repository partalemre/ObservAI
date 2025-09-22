import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useGroups, usePatchItem } from '../../features/menu/hooks'
import type { MenuItem } from '../../features/menu/types'

interface AssignGroupsDialogProps {
  storeId: string
  item: MenuItem
  onClose: () => void
}

export function AssignGroupsDialog({
  storeId,
  item,
  onClose,
}: AssignGroupsDialogProps) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    item.modifierGroupIds || []
  )

  const { data: groups = [] } = useGroups(storeId)
  const patchItem = usePatchItem(storeId)

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId)
      } else {
        return [...prev, groupId]
      }
    })
  }

  const handleMoveUp = (groupId: string) => {
    const currentIndex = selectedGroupIds.indexOf(groupId)
    if (currentIndex > 0) {
      const newOrder = [...selectedGroupIds]
      const [item] = newOrder.splice(currentIndex, 1)
      newOrder.splice(currentIndex - 1, 0, item)
      setSelectedGroupIds(newOrder)
    }
  }

  const handleMoveDown = (groupId: string) => {
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

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={t('menu.assign.title')}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-sm text-slate-600">
          Assigning modifier groups to: <strong>{item.name}</strong>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Available Groups */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-700">
              Available Groups
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {availableGroups.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  All groups assigned
                </p>
              ) : (
                availableGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                    onClick={() => handleToggleGroup(group.id)}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{group.name}</p>
                      <p className="text-xs text-slate-500">
                        Min: {group.min}, Max: {group.max},{' '}
                        {group.options.length} options
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleGroup(group.id)
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Groups */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-700">
              Selected Groups
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {selectedGroups.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No groups selected
                </p>
              ) : (
                selectedGroups.map((group, index) => (
                  <div
                    key={group.id}
                    className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border border-slate-200 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{group.name}</p>
                      <p className="text-xs text-slate-500">
                        Min: {group.min}, Max: {group.max},{' '}
                        {group.options.length} options
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(group.id)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(group.id)}
                        disabled={index === selectedGroups.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleGroup(group.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t border-slate-200 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={patchItem.isPending}
          >
            {t('menu.actions.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={patchItem.isPending}>
            {patchItem.isPending ? 'Saving...' : t('menu.assign.save')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
