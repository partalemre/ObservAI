export interface InventoryItem {
  id: string
  name: string
  sku?: string
  category?: string
  uom?: 'pcs' | 'kg' | 'lt'
  stockQty: number
  minQty: number // low-stock threshold
  reorderQty?: number // suggested reorder qty
  costPrice?: number // last known unit cost
  updatedAt: string
}

export type ReceivePayload = {
  storeId: string
  supplier?: string
  note?: string
  lines: { itemId: string; qty: number; unitCost?: number }[]
}

export type AdjustPayload = {
  storeId: string
  reason: 'COUNT' | 'WASTE' | 'DAMAGE' | 'OTHER'
  note?: string
  lines: { itemId: string; delta: number }[] // positive or negative
}
