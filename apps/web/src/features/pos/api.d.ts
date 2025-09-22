import type {
  Category,
  Item,
  ModifierGroup,
  NewOrder,
  OrderResponse,
} from './types'
export declare const catalogApi: {
  getCategories: (storeId: string) => Promise<Category[]>
  getItems: (storeId: string) => Promise<Item[]>
  getModifierGroups: (storeId: string) => Promise<ModifierGroup[]>
}
export declare const ordersApi: {
  createOrder: (order: NewOrder) => Promise<OrderResponse>
}
