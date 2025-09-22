import {
  CashDrawerState,
  OpenDrawerPayload,
  CashInOutPayload,
  CloseDrawerPayload,
  CashMovement,
} from './types'
export declare const getDrawer: (storeId: string) => Promise<CashDrawerState>
export declare const getMovements: (storeId: string) => Promise<{
  items: CashMovement[]
}>
export declare const openDrawer: (
  payload: OpenDrawerPayload
) => Promise<import('axios').AxiosResponse<any, any, {}>>
export declare const cashIn: (
  payload: CashInOutPayload
) => Promise<import('axios').AxiosResponse<any, any, {}>>
export declare const cashOut: (
  payload: CashInOutPayload
) => Promise<import('axios').AxiosResponse<any, any, {}>>
export declare const closeDrawer: (
  payload: CloseDrawerPayload
) => Promise<import('axios').AxiosResponse<any, any, {}>>
