export declare const ITEMS_KEY: (storeId: string) => string[]
export declare const useInventoryItems: (
  storeId?: string
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').InventoryItem[],
  Error
>
export declare const useReceive: (
  storeId?: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  import('./types').ReceivePayload,
  unknown
>
export declare const useAdjust: (
  storeId?: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  import('./types').AdjustPayload,
  unknown
>
