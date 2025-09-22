export interface Category {
  id: string
  name: string
  sort: number
}

export interface Item {
  id: string
  name: string
  price: number
  imageUrl?: string
  categoryId: string
  sku?: string
  modifierGroupIds?: string[]
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

export interface ChosenModifier {
  groupId: string
  optionId: string
  name: string
  priceDelta: number
}

export interface CartLine {
  id: string
  itemId: string
  name: string
  qty: number
  unitPrice: number
  modifiers?: ChosenModifier[]
}

export interface Discount {
  type: 'percent' | 'amount'
  value: number
}

export interface Totals {
  subtotal: number
  discountTotal: number
  tax: number
  total: number
}

export interface NewOrder {
  storeId: string
  lines: {
    itemId: string
    name: string
    qty: number
    unitPrice: number
    modifiers?: {
      groupId: string
      optionId: string
      name: string
      priceDelta: number
    }[]
    lineTotal: number
  }[]
  discounts?: { type: 'percent' | 'amount'; value: number }[]
  payments: { method: 'cash' | 'card'; amount: number; change: number }[]
  subtotal: number
  discountTotal: number
  tax: number
  total: number
  note?: string
}

export interface OrderResponse {
  orderId: string
}
