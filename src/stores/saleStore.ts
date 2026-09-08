import { create } from 'zustand'
import type { SaleSummaryResponse, SaleResponse, SaleStatus } from '@/types'

interface SaleStore {
  sales: SaleSummaryResponse[]             // all sales (admin/lead view)
  mySales: SaleSummaryResponse[]           // marketer's own sales
  distributorSales: SaleSummaryResponse[]  // distributor's assigned-marketer sales
  selectedSale: SaleResponse | null
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setSales:              (sales: SaleSummaryResponse[]) => void
  setMySales:            (sales: SaleSummaryResponse[]) => void
  setDistributorSales:   (sales: SaleSummaryResponse[]) => void
  setSelectedSale:       (sale: SaleResponse | null)    => void
  setLoading:            (v: boolean)                   => void
  setActionLoading:      (v: boolean)                   => void
  setError:              (e: string | null)             => void
  updateSaleStatus:      (id: string, status: SaleStatus) => void
}

export const useSaleStore = create<SaleStore>()((set, get) => ({
  sales: [],
  mySales: [],
  distributorSales: [],
  selectedSale: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setSales:            (sales)             => set({ sales }),
  setMySales:          (mySales)           => set({ mySales }),
  setDistributorSales: (distributorSales)  => set({ distributorSales }),
  setSelectedSale:     (selectedSale)      => set({ selectedSale }),
  setLoading:          (isLoading)         => set({ isLoading }),
  setActionLoading:    (isActionLoading)   => set({ isActionLoading }),
  setError:            (error)             => set({ error }),

  updateSaleStatus: (id, status) => {
    const patch = (list: SaleSummaryResponse[]) =>
      list.map((s) => (s.id === id ? { ...s, status } : s))
    set({
      sales:            patch(get().sales),
      mySales:          patch(get().mySales),
      distributorSales: patch(get().distributorSales),
    })
    const sel = get().selectedSale
    if (sel?.id === id) set({ selectedSale: { ...sel, status } })
  },
}))
