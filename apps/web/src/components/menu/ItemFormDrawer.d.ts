import type { MenuItem } from '../../features/menu/types'
interface ItemFormDrawerProps {
  storeId: string
  item?: MenuItem
  onClose: () => void
}
export declare function ItemFormDrawer({
  storeId,
  item,
  onClose,
}: ItemFormDrawerProps): import('react/jsx-runtime').JSX.Element
export {}
