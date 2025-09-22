import { useState } from 'react'
import { Button } from '../ui/Button'
import { t } from '../../lib/i18n'
import { useUploadImage } from '../../features/menu/hooks'

interface ImagePickerProps {
  value?: string
  onChange: (url: string | undefined) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [dragOver, setDragOver] = useState(false)
  const uploadImage = useUploadImage()

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      uploadImage.mutate(base64, {
        onSuccess: (data) => {
          onChange(data.url)
        },
      })
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        {t('menu.items.image')}
      </label>

      {value ? (
        <div className="space-y-2">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200">
            <img
              src={value}
              alt="Item"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
            className="text-red-600 hover:text-red-700"
          >
            {t('menu.items.remove')}
          </Button>
        </div>
      ) : (
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 text-center ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-300'} ${uploadImage.isPending ? 'opacity-50' : ''} `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={uploadImage.isPending}
          />

          <div className="space-y-2">
            <div className="text-slate-400">📷</div>
            <p className="text-sm text-slate-600">
              {uploadImage.isPending ? 'Uploading...' : t('menu.items.choose')}
            </p>
            <p className="text-xs text-slate-400">
              Drag & drop or click to select
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
