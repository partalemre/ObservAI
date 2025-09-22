import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime'
import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useCreateGroup, usePatchGroup } from '../../features/menu/hooks'
export function GroupFormDialog({ storeId, group, onClose }) {
  const [name, setName] = useState(group?.name || '')
  const [min, setMin] = useState(group?.min?.toString() || '0')
  const [max, setMax] = useState(group?.max?.toString() || '1')
  const [options, setOptions] = useState(
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
  const handleRemoveOption = (index) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }
  const handleSubmit = (e) => {
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
  return _jsx(Modal, {
    isOpen: true,
    onClose: onClose,
    title: isEditing ? 'Edit Modifier Group' : 'New Modifier Group',
    className: 'max-w-2xl',
    children: _jsxs('form', {
      onSubmit: handleSubmit,
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          children: [
            _jsxs('label', {
              htmlFor: 'name',
              className: 'mb-1 block text-sm font-medium text-slate-700',
              children: [t('menu.groups.name'), ' *'],
            }),
            _jsx('input', {
              id: 'name',
              type: 'text',
              value: name,
              onChange: (e) => setName(e.target.value),
              className:
                'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
              placeholder: 'Enter group name',
              required: true,
            }),
          ],
        }),
        _jsxs('div', {
          className: 'grid grid-cols-2 gap-4',
          children: [
            _jsxs('div', {
              children: [
                _jsxs('label', {
                  htmlFor: 'min',
                  className: 'mb-1 block text-sm font-medium text-slate-700',
                  children: [t('menu.groups.min'), ' *'],
                }),
                _jsx('input', {
                  id: 'min',
                  type: 'number',
                  min: '0',
                  value: min,
                  onChange: (e) => setMin(e.target.value),
                  className:
                    'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                  required: true,
                }),
              ],
            }),
            _jsxs('div', {
              children: [
                _jsxs('label', {
                  htmlFor: 'max',
                  className: 'mb-1 block text-sm font-medium text-slate-700',
                  children: [t('menu.groups.max'), ' *'],
                }),
                _jsx('input', {
                  id: 'max',
                  type: 'number',
                  min: '1',
                  value: max,
                  onChange: (e) => setMax(e.target.value),
                  className:
                    'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                  required: true,
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          children: [
            _jsxs('div', {
              className: 'mb-3 flex items-center justify-between',
              children: [
                _jsxs('label', {
                  className: 'block text-sm font-medium text-slate-700',
                  children: [t('menu.groups.options'), ' *'],
                }),
                _jsx(Button, {
                  type: 'button',
                  variant: 'ghost',
                  size: 'sm',
                  onClick: handleAddOption,
                  children: t('menu.groups.addOption'),
                }),
              ],
            }),
            _jsx('div', {
              className: 'space-y-3',
              children: options.map((option, index) =>
                _jsxs(
                  'div',
                  {
                    className: 'flex items-start gap-3',
                    children: [
                      _jsx('div', {
                        className: 'flex-1',
                        children: _jsx('input', {
                          type: 'text',
                          value: option.name,
                          onChange: (e) =>
                            handleOptionChange(index, 'name', e.target.value),
                          className:
                            'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                          placeholder: t('menu.groups.optionName'),
                        }),
                      }),
                      _jsx('div', {
                        className: 'w-32',
                        children: _jsx('input', {
                          type: 'number',
                          step: '0.01',
                          value: option.priceDelta,
                          onChange: (e) =>
                            handleOptionChange(
                              index,
                              'priceDelta',
                              e.target.value
                            ),
                          className:
                            'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                          placeholder: t('menu.groups.delta'),
                        }),
                      }),
                      options.length > 1 &&
                        _jsx(Button, {
                          type: 'button',
                          variant: 'ghost',
                          size: 'sm',
                          onClick: () => handleRemoveOption(index),
                          className: 'mt-1 text-red-600 hover:text-red-700',
                          children: '\u2715',
                        }),
                    ],
                  },
                  index
                )
              ),
            }),
          ],
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
              disabled: !isFormValid || mutation.isPending,
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
