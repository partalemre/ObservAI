import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useCreateGroup, usePatchGroup } from '../../features/menu/hooks'
import type { ModifierGroup, ModifierOption } from '../../features/menu/types'

interface GroupFormDialogProps {
  storeId: string
  group?: ModifierGroup
  onClose: () => void
}

interface OptionForm {
  id?: string
  name: string
  priceDelta: string
}

export function GroupFormDialog({
  storeId,
  group,
  onClose,
}: GroupFormDialogProps) {
  const [name, setName] = useState(group?.name || '')
  const [min, setMin] = useState(group?.min?.toString() || '0')
  const [max, setMax] = useState(group?.max?.toString() || '1')
  const [options, setOptions] = useState<OptionForm[]>(
    group?.options.map((opt) => ({
      id: opt.id,
      name: opt.name,
      priceDelta: opt.priceDelta.toString(),
    })) || [{ name: '', priceDelta: '0' }]
  )

  const createGroup = useCreateGroup(storeId)
  const patchGroup = usePatchGroup(storeId)

  const isEditing = !!group
  const mutation = isEditing ? patchGroup : createGroup

  const handleAddOption = () => {
    setOptions([...options, { name: '', priceDelta: '0' }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (
    index: number,
    field: keyof OptionForm,
    value: string
  ) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedMin = parseInt(min)
    const parsedMax = parseInt(max)

    if (
      !name.trim() ||
      isNaN(parsedMin) ||
      isNaN(parsedMax) ||
      parsedMin < 0 ||
      parsedMax < parsedMin
    ) {
      return
    }

    const validOptions = options.filter((opt) => opt.name.trim())
    if (validOptions.length === 0) return

    const formattedOptions = validOptions.map((opt) => ({
      id: opt.id,
      name: opt.name.trim(),
      priceDelta: parseFloat(opt.priceDelta) || 0,
    }))

    const groupData = {
      name: name.trim(),
      min: parsedMin,
      max: parsedMax,
      options: formattedOptions,
    }

    if (isEditing) {
      patchGroup.mutate({ id: group.id, ...groupData }, { onSuccess: onClose })
    } else {
      createGroup.mutate({ storeId, ...groupData }, { onSuccess: onClose })
    }
  }

  const validOptions = options.filter((opt) => opt.name.trim())
  const isFormValid =
    name.trim() &&
    !isNaN(parseInt(min)) &&
    !isNaN(parseInt(max)) &&
    parseInt(min) >= 0 &&
    parseInt(max) >= parseInt(min) &&
    validOptions.length > 0

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Modifier Group' : 'New Modifier Group'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {t('menu.groups.name')} *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="min"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {t('menu.groups.min')} *
            </label>
            <input
              id="min"
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="max"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {t('menu.groups.max')} *
            </label>
            <input
              id="max"
              type="number"
              min="1"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              {t('menu.groups.options')} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddOption}
            >
              {t('menu.groups.addOption')}
            </Button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) =>
                      handleOptionChange(index, 'name', e.target.value)
                    }
                    className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder={t('menu.groups.optionName')}
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    value={option.priceDelta}
                    onChange={(e) =>
                      handleOptionChange(index, 'priceDelta', e.target.value)
                    }
                    className="focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder={t('menu.groups.delta')}
                  />
                </div>
                {options.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="mt-1 text-red-600 hover:text-red-700"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {t('menu.actions.cancel')}
          </Button>
          <Button type="submit" disabled={!isFormValid || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : t('menu.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
