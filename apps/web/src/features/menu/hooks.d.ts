import type { MenuCategory, MenuItem, ModifierGroup } from './types'
export declare const CAT_KEY: (storeId: string) => string[]
export declare const ITEM_KEY: (storeId: string) => string[]
export declare const GRP_KEY: (storeId: string) => string[]
export declare const useCategories: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<MenuCategory[], Error>
export declare const useCreateCategory: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    storeId: string
    name: string
  },
  unknown
>
export declare const usePatchCategory: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    id: string
  } & Partial<MenuCategory>,
  unknown
>
export declare const useDeleteCategory: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  string,
  unknown
>
export declare const useReorderCategories: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    storeId: string
    order: string[]
  },
  unknown
>
export declare const useItems: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<MenuItem[], Error>
export declare const useCreateItem: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  Omit<MenuItem, 'id'> & {
    storeId: string
  },
  unknown
>
export declare const usePatchItem: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    id: string
  } & Partial<MenuItem>,
  unknown
>
export declare const useDeleteItem: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  string,
  unknown
>
export declare const useGroups: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<ModifierGroup[], Error>
export declare const useCreateGroup: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    storeId: string
    name: string
    min: number
    max: number
    options: {
      name: string
      priceDelta: number
    }[]
  },
  unknown
>
export declare const usePatchGroup: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    id: string
  } & Partial<ModifierGroup>,
  unknown
>
export declare const useDeleteGroup: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  string,
  unknown
>
export declare const useUploadImage: () => import('@tanstack/react-query').UseMutationResult<
  {
    url: string
  },
  Error,
  string,
  unknown
>
