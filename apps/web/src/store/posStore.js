import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export const usePOS = create()(
  persist(
    (set, get) => ({
      lines: [],
      taxRate: 0,
      addItem: (item, qty = 1, chosen = []) =>
        set((s) => {
          const id = crypto.randomUUID()
          const unit =
            item.price + chosen.reduce((a, c) => a + (c.priceDelta || 0), 0)
          const line = {
            id,
            itemId: item.id,
            name: item.name,
            qty,
            unitPrice: unit,
            modifiers: chosen,
          }
          return { lines: [...s.lines, line] }
        }),
      updateQty: (id, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      removeLine: (id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      setDiscount: (d) => set({ discount: d }),
      setNote: (n) => set({ note: n }),
      clear: () => set({ lines: [], discount: undefined, note: '' }),
      totals: () => {
        const { lines, discount, taxRate } = get()
        const subtotal = lines.reduce((a, l) => a + l.unitPrice * l.qty, 0)
        const discountTotal = discount
          ? discount.type === 'percent'
            ? subtotal * (discount.value / 100)
            : discount.value
          : 0
        const taxedBase = Math.max(0, subtotal - discountTotal)
        const tax = taxedBase * taxRate
        const total = taxedBase + tax
        return { subtotal, discountTotal, tax, total }
      },
    }),
    { name: 'observai-pos' }
  )
)
