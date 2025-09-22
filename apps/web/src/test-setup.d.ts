import '@testing-library/jest-dom'
import 'whatwg-fetch'
type DB = {
  tickets: any[]
}
export declare const ordersDb: DB
export declare const seedOrder: (ticket: any) => void
type InvDB = {
  items: any[]
}
export declare const inventoryDb: InvDB
export declare const menuDb: {
  categories: {
    id: string
    name: string
    sort: number
    active: boolean
  }[]
  items: {
    id: string
    name: string
    price: number
    categoryId: string
    active: boolean
    soldOut: boolean
    sku: string
    modifierGroupIds: string[]
  }[]
  groups: {
    id: string
    name: string
    min: number
    max: number
    options: {
      id: string
      name: string
      priceDelta: number
    }[]
  }[]
}
export declare const handlers: import('msw').HttpHandler[]
export {}
