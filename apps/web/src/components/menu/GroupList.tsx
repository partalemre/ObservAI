import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { t } from '../../lib/i18n'
import { useGroups, useDeleteGroup } from '../../features/menu/hooks'
import { GroupFormDialog } from './GroupFormDialog'
import type { ModifierGroup } from '../../features/menu/types'

interface GroupListProps {
  storeId: string
}

export function GroupList({ storeId }: GroupListProps) {
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<ModifierGroup | null>(null)
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
    return <div className="animate-pulse">Loading modifier groups...</div>
  }

  if (groups.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p>{t('menu.groups.empty')}</p>
        <Button onClick={() => setShowCreateForm(true)} className="mt-4">
          {t('menu.actions.newGroup')}
        </Button>
        {showCreateForm && (
          <GroupFormDialog
            storeId={storeId}
            onClose={() => setShowCreateForm(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  {t('menu.groups.name')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  {t('menu.groups.min')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  {t('menu.groups.max')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  {t('menu.groups.options')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{group.name}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{group.min}</td>
                  <td className="px-4 py-3 text-slate-700">{group.max}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {group.options.length}{' '}
                    {group.options.length === 1 ? 'option' : 'options'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGroup(group)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingGroup(group)}
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

      {editingGroup && (
        <GroupFormDialog
          storeId={storeId}
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}

      {deletingGroup && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingGroup(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p>{t('menu.confirm.deleteGroup')}</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setDeletingGroup(null)}>
                {t('menu.actions.cancel')}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteGroup.isPending}
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
