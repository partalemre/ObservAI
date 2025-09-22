import type { OrderStatus } from './types'
export declare const FEED_KEY: (storeId: string) => string[]
export declare const useOrderFeed: (
  storeId?: string,
  strategy?: 'poll' | 'sse' | 'ws'
) => import('@tanstack/react-query').UseQueryResult<
  import('./types').OrderTicket[],
  Error
>
export declare const useUpdateOrderStatus: (
  storeId?: string
) => import('@tanstack/react-query').UseMutationResult<
  any,
  Error,
  {
    id: string
    status: OrderStatus
  },
  unknown
>
