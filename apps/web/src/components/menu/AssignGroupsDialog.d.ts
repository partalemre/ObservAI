import type { MenuItem } from '../../features/menu/types'
interface AssignGroupsDialogProps {
  storeId: string
  item: MenuItem
  onClose: () => void
}
export declare function AssignGroupsDialog({
  storeId,
  item,
  onClose,
}: AssignGroupsDialogProps): import('react/jsx-runtime').JSX.Element
export {}
