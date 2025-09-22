import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import {
  useCreateItem,
  usePatchItem,
  useCategories,
} from '../../features/menu/hooks'
import { ImagePicker } from './ImagePicker'
export function ItemFormDrawer({ storeId, item, onClose }) {
  const [name, setName] = useState(item?.name || '')
  const [price, setPrice] = useState(item?.price?.toString() || '')
  const [categoryId, setCategoryId] = useState(item?.categoryId || '')
  const [sku, setSku] = useState(item?.sku || '')
  const [description, setDescription] = useState(item?.description || '')
  const [active, setActive] = useState(item?.active ?? true)
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '')
  const [tags, setTags] = useState(item?.tags?.join(', ') || '')
  const { data: categories = [] } = useCategories(storeId)
  const createItem = useCreateItem(storeId)
  const patchItem = usePatchItem(storeId)
  const isEditing = !!item
  const mutation = isEditing ? patchItem : createItem
  // Set default category if none selected and categories are available
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return
    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) return
    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    const itemData = {
      name: name.trim(),
      price: parsedPrice,
      categoryId,
      sku: sku.trim() || undefined,
      description: description.trim() || undefined,
      active,
      soldOut: false,
      imageUrl: imageUrl || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      modifierGroupIds: item?.modifierGroupIds || [],
    }
    if (isEditing) {
      patchItem.mutate({ id: item.id, ...itemData }, { onSuccess: onClose })
    } else {
      createItem.mutate({ storeId, ...itemData }, { onSuccess: onClose })
    }
  }
  return _jsxs('div', {
    className: 'fixed inset-0 z-50 overflow-hidden',
    children: [
      _jsx('div', {
        className: 'bg-opacity-50 absolute inset-0 bg-black',
        onClick: onClose,
      }),
      _jsx('div', {
        className:
          'absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl',
        children: _jsxs('div', {
          className: 'flex h-full flex-col',
          children: [
            _jsx('div', {
              className: 'border-b border-slate-200 px-6 py-4',
              children: _jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  _jsx('h2', {
                    className: 'text-lg font-medium text-slate-900',
                    children: isEditing ? 'Edit Item' : 'New Item',
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: onClose,
                    className: 'text-slate-400 hover:text-slate-600',
                    children: '\u2715',
                  }),
                ],
              }),
            }),
            _jsx('div', {
              className: 'flex-1 overflow-y-auto',
              children: _jsxs('form', {
                onSubmit: handleSubmit,
                className: 'space-y-6 p-6',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsx('label', {
                        htmlFor: 'name',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: 'Name *',
                      }),
                      _jsx('input', {
                        id: 'name',
                        type: 'text',
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        placeholder: 'Enter item name',
                        required: true,
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    children: [
                      _jsxs('label', {
                        htmlFor: 'price',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: [t('menu.common.price'), ' *'],
                      }),
                      _jsx('input', {
                        id: 'price',
                        type: 'number',
                        step: '0.01',
                        min: '0',
                        value: price,
                        onChange: (e) => setPrice(e.target.value),
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        placeholder: '0.00',
                        required: true,
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    children: [
                      _jsxs('label', {
                        htmlFor: 'category',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: [t('menu.common.category'), ' *'],
                      }),
                      _jsxs('select', {
                        id: 'category',
                        value: categoryId,
                        onChange: (e) => setCategoryId(e.target.value),
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        required: true,
                        children: [
                          _jsx('option', {
                            value: '',
                            children: 'Select category',
                          }),
                          categories.map((category) =>
                            _jsx(
                              'option',
                              { value: category.id, children: category.name },
                              category.id
                            )
                          ),
                        ],
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('label', {
                        htmlFor: 'sku',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: t('menu.common.sku'),
                      }),
                      _jsx('input', {
                        id: 'sku',
                        type: 'text',
                        value: sku,
                        onChange: (e) => setSku(e.target.value),
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        placeholder: 'Enter SKU',
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('label', {
                        htmlFor: 'description',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: t('menu.common.description'),
                      }),
                      _jsx('textarea', {
                        id: 'description',
                        value: description,
                        onChange: (e) => setDescription(e.target.value),
                        rows: 3,
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        placeholder: 'Enter description',
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    children: [
                      _jsx('label', {
                        htmlFor: 'tags',
                        className:
                          'mb-1 block text-sm font-medium text-slate-700',
                        children: t('menu.common.tags'),
                      }),
                      _jsx('input', {
                        id: 'tags',
                        type: 'text',
                        value: tags,
                        onChange: (e) => setTags(e.target.value),
                        className:
                          'focus:ring-primary focus:border-primary w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none',
                        placeholder: 'Enter tags separated by commas',
                      }),
                    ],
                  }),
                  _jsx(ImagePicker, { value: imageUrl, onChange: setImageUrl }),
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
                ],
              }),
            }),
            _jsx('div', {
              className: 'border-t border-slate-200 px-6 py-4',
              children: _jsxs('div', {
                className: 'flex justify-end space-x-3',
                children: [
                  _jsx(Button, {
                    type: 'button',
                    variant: 'ghost',
                    onClick: onClose,
                    disabled: mutation.isPending,
                    children: t('menu.actions.cancel'),
                  }),
                  _jsx(Button, {
                    onClick: handleSubmit,
                    disabled:
                      !name.trim() ||
                      !price ||
                      !categoryId ||
                      mutation.isPending,
                    children: mutation.isPending
                      ? 'Saving...'
                      : t('menu.actions.save'),
                  }),
                ],
              }),
            }),
          ],
        }),
      }),
    ],
  })
}
