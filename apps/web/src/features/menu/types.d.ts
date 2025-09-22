export interface MenuCategory {
  id: string
  name: string
  sort: number
  active: boolean
}
export interface MenuItem {
  id: string
  name: string
  price: number
  categoryId: string
  sku?: string
  active: boolean
  soldOut: boolean
  imageUrl?: string
  description?: string
  modifierGroupIds?: string[]
  tags?: string[]
}
export interface ModifierOption {
  id: string
  name: string
  priceDelta: number
}
export interface ModifierGroup {
  id: string
  name: string
  min: number
  max: number
  options: ModifierOption[]
}
