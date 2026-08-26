import { create } from 'zustand'
import type { SaleSummaryResponse, SaleResponse, SaleStatus } from '@/types'

interface SaleStore {
  sales: SaleSummaryResponse[]         // all sales (admin/lead view)
  mySales: SaleSummaryResponse[]       // marketer's own sales
  selectedSale: SaleResponse | null    // full detail for modal/view
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setSales:          (sales: SaleSummaryResponse[])    => void
  setMySales:        (sales: SaleSummaryResponse[])    => void
  setSelectedSale:   (sale: SaleResponse | null)       => void
  setLoading:        (v: boolean)                      => void
  setActionLoading:  (v: boolean)                      => void
  setError:          (e: string | null)                => void
  updateSaleStatus:  (id: string, status: SaleStatus) => void
}

export const useSaleStore = create<SaleStore>()((set, get) => ({
  sales: [],
  mySales: [],
  selectedSale: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setSales:         (sales)         => set({ sales }),
  setMySales:       (mySales)       => set({ mySales }),
  setSelectedSale:  (selectedSale)  => set({ selectedSale }),
  setLoading:       (isLoading)     => set({ isLoading }),
  setActionLoading: (isActionLoading) => set({ isActionLoading }),
  setError:         (error)         => set({ error }),

  updateSaleStatus: (id, status) => {
    const patch = (list: SaleSummaryResponse[]) =>
      list.map((s) => (s.id === id ? { ...s, status } : s))
    set({ sales: patch(get().sales), mySales: patch(get().mySales) })

    const sel = get().selectedSale
    if (sel?.id === id) set({ selectedSale: { ...sel, status } })
  },
}))
