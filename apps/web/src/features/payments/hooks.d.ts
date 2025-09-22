import type {
  OpenDrawerPayload,
  CashInOutPayload,
  CloseDrawerPayload,
} from './types'
export declare const DRAWER_KEY: (storeId: string) => string[]
export declare const MOVES_KEY: (storeId: string) => string[]
export declare const useDrawer: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').CashDrawerState,
  Error
>
export declare const useMovements: (
  storeId: string
) => import('@tanstack/react-query').UseQueryResult<
  {
    items: import('./types').CashMovement[]
  },
  Error
>
export declare const useOpenDrawer: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  import('axios').AxiosResponse<any, any, {}>,
  Error,
  OpenDrawerPayload,
  unknown
>
export declare const useCashIn: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  import('axios').AxiosResponse<any, any, {}>,
  Error,
  CashInOutPayload,
  unknown
>
export declare const useCashOut: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  import('axios').AxiosResponse<any, any, {}>,
  Error,
  CashInOutPayload,
  unknown
>
export declare const useCloseDrawer: (
  storeId: string
) => import('@tanstack/react-query').UseMutationResult<
  import('axios').AxiosResponse<any, any, {}>,
  Error,
  CloseDrawerPayload,
  unknown
>
