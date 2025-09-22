import type {
  Item,
  ChosenModifier,
  Discount,
  CartLine,
  Totals,
} from '../features/pos/types'
type POSState = {
  lines: CartLine[]
  discount?: Discount
  note?: string
  taxRate: number
  addItem: (item: Item, qty?: number, chosen?: ChosenModifier[]) => void
  updateQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  setDiscount: (d?: Discount) => void
  setNote: (n: string) => void
  clear: () => void
  totals: () => Totals
}
export declare const usePOS: import('zustand').UseBoundStore<
  Omit<import('zustand').StoreApi<POSState>, 'setState' | 'persist'> & {
    setState(
      partial:
        | POSState
        | Partial<POSState>
        | ((state: POSState) => POSState | Partial<POSState>),
      replace?: false | undefined
    ): unknown
    setState(
      state: POSState | ((state: POSState) => POSState),
      replace: true
    ): unknown
    persist: {
      setOptions: (
        options: Partial<
          import('zustand/middleware').PersistOptions<
            POSState,
            POSState,
            unknown
          >
        >
      ) => void
      clearStorage: () => void
      rehydrate: () => Promise<void> | void
      hasHydrated: () => boolean
      onHydrate: (fn: (state: POSState) => void) => () => void
      onFinishHydration: (fn: (state: POSState) => void) => () => void
      getOptions: () => Partial<
        import('zustand/middleware').PersistOptions<POSState, POSState, unknown>
      >
    }
  }
>
export {}
