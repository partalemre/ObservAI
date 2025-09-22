import type { InventoryItem, ReceivePayload, AdjustPayload } from './types'
export declare const fetchItems: (storeId: string) => Promise<InventoryItem[]>
export declare const postReceive: (payload: ReceivePayload) => Promise<any>
export declare const postAdjust: (payload: AdjustPayload) => Promise<any>
