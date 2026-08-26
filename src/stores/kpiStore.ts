import { create } from 'zustand'
import type { KpiPeriodResponse } from '@/types'

interface KpiStore {
  periods: KpiPeriodResponse[]
  currentPeriod: KpiPeriodResponse | null
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setPeriods:       (periods: KpiPeriodResponse[])    => void
  setCurrentPeriod: (p: KpiPeriodResponse | null)     => void
  setLoading:       (v: boolean)                      => void
  setActionLoading: (v: boolean)                      => void
  setError:         (e: string | null)                => void
  upsertPeriod:     (p: KpiPeriodResponse)            => void
}

export const useKpiStore = create<KpiStore>()((set, get) => ({
  periods: [],
  currentPeriod: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setPeriods:       (periods)       => set({ periods }),
  setCurrentPeriod: (currentPeriod) => set({ currentPeriod }),
  setLoading:       (isLoading)     => set({ isLoading }),
  setActionLoading: (isActionLoading) => set({ isActionLoading }),
  setError:         (error)         => set({ error }),

  upsertPeriod: (p) => {
    const exists = get().periods.some((x) => x.id === p.id)
    set({
      periods: exists
        ? get().periods.map((x) => (x.id === p.id ? p : x))
        : [...get().periods, p],
    })
  },
}))
