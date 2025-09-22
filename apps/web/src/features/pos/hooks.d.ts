import type { NewOrder } from './types'
export declare const useCategories: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').Category[],
  Error
>
export declare const useItems: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').Item[],
  Error
>
export declare const useModifierGroups: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').ModifierGroup[],
  Error
>
export declare const useCreateOrder: () => import('@tanstack/react-query').UseMutationResult<
  import('./types').OrderResponse,
  Error,
  NewOrder,
  unknown
>
