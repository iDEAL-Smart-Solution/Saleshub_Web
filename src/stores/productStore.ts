import { create } from 'zustand'
import type { ProductResponse } from '@/types'

interface ProductStore {
  products: ProductResponse[]
  selectedProduct: ProductResponse | null
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setProducts: (products: ProductResponse[]) => void
  setSelectedProduct: (p: ProductResponse | null) => void
  setLoading: (v: boolean) => void
  setActionLoading: (v: boolean) => void
  setError: (e: string | null) => void
  upsertProduct: (p: ProductResponse) => void
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setProducts:        (products)        => set({ products }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setLoading:         (isLoading)       => set({ isLoading }),
  setActionLoading:   (isActionLoading) => set({ isActionLoading }),
  setError:           (error)           => set({ error }),

  upsertProduct: (p) => {
    const exists = get().products.some((x) => x.id === p.id)
    set({
      products: exists
        ? get().products.map((x) => (x.id === p.id ? p : x))
        : [...get().products, p],
    })
  },
}))
