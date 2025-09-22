import type { MenuCategory } from '../../features/menu/types'
interface CategoryFormDialogProps {
  storeId: string
  category?: MenuCategory
  onClose: () => void
}
export declare function CategoryFormDialog({
  storeId,
  category,
  onClose,
}: CategoryFormDialogProps): import('react/jsx-runtime').JSX.Element
export {}
