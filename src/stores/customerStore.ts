import { create } from 'zustand'
import type { CustomerResponse } from '@/types'

interface CustomerStore {
  customers: CustomerResponse[]
  selectedCustomer: CustomerResponse | null
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setCustomers:        (customers: CustomerResponse[]) => void
  setSelectedCustomer: (c: CustomerResponse | null)    => void
  setLoading:          (v: boolean)                    => void
  setActionLoading:    (v: boolean)                    => void
  setError:            (e: string | null)              => void
  upsertCustomer:      (c: CustomerResponse)           => void
}

export const useCustomerStore = create<CustomerStore>()((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setCustomers:        (customers)        => set({ customers }),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
  setLoading:          (isLoading)        => set({ isLoading }),
  setActionLoading:    (isActionLoading)  => set({ isActionLoading }),
  setError:            (error)            => set({ error }),

  upsertCustomer: (c) => {
    const exists = get().customers.some((x) => x.id === c.id)
    set({
      customers: exists
        ? get().customers.map((x) => (x.id === c.id ? c : x))
        : [...get().customers, c],
    })
  },
}))
