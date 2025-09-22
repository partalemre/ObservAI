import type { MenuCategory, MenuItem, ModifierGroup } from './types'
export declare const getCategories: (storeId: string) => Promise<MenuCategory[]>
export declare const createCategory: (params: {
  storeId: string
  name: string
}) => Promise<any>
export declare const patchCategory: (
  id: string,
  params: Partial<MenuCategory>
) => Promise<any>
export declare const deleteCategory: (id: string) => Promise<any>
export declare const reorderCategories: (params: {
  storeId: string
  order: string[]
}) => Promise<any>
export declare const getItems: (storeId: string) => Promise<MenuItem[]>
export declare const createItem: (
  params: Omit<MenuItem, 'id'> & {
    storeId: string
  }
) => Promise<any>
export declare const patchItem: (
  id: string,
  params: Partial<MenuItem>
) => Promise<any>
export declare const deleteItem: (id: string) => Promise<any>
export declare const getGroups: (storeId: string) => Promise<ModifierGroup[]>
export declare const createGroup: (params: {
  storeId: string
  name: string
  min: number
  max: number
  options: {
    name: string
    priceDelta: number
  }[]
}) => Promise<any>
export declare const patchGroup: (
  id: string,
  params: Partial<ModifierGroup>
) => Promise<any>
export declare const deleteGroup: (id: string) => Promise<any>
export declare const uploadImage: (base64: string) => Promise<{
  url: string
}>
