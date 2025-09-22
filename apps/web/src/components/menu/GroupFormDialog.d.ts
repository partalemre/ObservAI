import type { ModifierGroup } from '../../features/menu/types'
interface GroupFormDialogProps {
  storeId: string
  group?: ModifierGroup
  onClose: () => void
}
export declare function GroupFormDialog({
  storeId,
  group,
  onClose,
}: GroupFormDialogProps): import('react/jsx-runtime').JSX.Element
export {}
