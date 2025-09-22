import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useUploadImage } from '../../features/menu/hooks'
export function ImagePicker({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false)
  const uploadImage = useUploadImage()
  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result
      uploadImage.mutate(base64, {
        onSuccess: (data) => {
          onChange(data.url)
        },
      })
    }
    reader.readAsDataURL(file)
  }
  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }
  return _jsxs('div', {
    className: 'space-y-3',
    children: [
      _jsx('label', {
        className: 'block text-sm font-medium text-slate-700',
        children: t('menu.items.image'),
      }),
      value
        ? _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsx('div', {
                className:
                  'relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200',
                children: _jsx('img', {
                  src: value,
                  alt: 'Item',
                  className: 'h-full w-full object-cover',
                }),
              }),
              _jsx(Button, {
                type: 'button',
                variant: 'ghost',
                size: 'sm',
                onClick: () => onChange(undefined),
                className: 'text-red-600 hover:text-red-700',
                children: t('menu.items.remove'),
              }),
            ],
          })
        : _jsxs('div', {
            className: `relative rounded-lg border-2 border-dashed p-6 text-center ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-300'} ${uploadImage.isPending ? 'opacity-50' : ''} `,
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            children: [
              _jsx('input', {
                type: 'file',
                accept: 'image/*',
                onChange: handleInputChange,
                className:
                  'absolute inset-0 h-full w-full cursor-pointer opacity-0',
                disabled: uploadImage.isPending,
              }),
              _jsxs('div', {
                className: 'space-y-2',
                children: [
                  _jsx('div', {
                    className: 'text-slate-400',
                    children: '\uD83D\uDCF7',
                  }),
                  _jsx('p', {
                    className: 'text-sm text-slate-600',
                    children: uploadImage.isPending
                      ? 'Uploading...'
                      : t('menu.items.choose'),
                  }),
                  _jsx('p', {
                    className: 'text-xs text-slate-400',
                    children: 'Drag & drop or click to select',
                  }),
                ],
              }),
            ],
          }),
    ],
  })
}
