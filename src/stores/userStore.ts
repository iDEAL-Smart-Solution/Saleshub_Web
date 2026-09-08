import { create } from 'zustand'
import type { UserSummaryResponse, UserResponse, DistributorSummaryResponse } from '@/types'

interface UserStore {
  users: UserSummaryResponse[]
  pendingMarketers: UserSummaryResponse[]
  distributors: DistributorSummaryResponse[]
  selectedUser: UserResponse | null
  isLoading: boolean
  isActionLoading: boolean
  error: string | null

  setUsers:              (users: UserSummaryResponse[])              => void
  setPendingMarketers:   (users: UserSummaryResponse[])              => void
  setDistributors:       (distributors: DistributorSummaryResponse[]) => void
  setSelectedUser:       (user: UserResponse | null)                 => void
  setLoading:            (v: boolean)                                => void
  setActionLoading:      (v: boolean)                                => void
  setError:              (error: string | null)                      => void
  updateUserInList:      (updated: UserSummaryResponse)              => void
  removeUserFromList:    (id: string)                                => void
}

export const useUserStore = create<UserStore>()((set, get) => ({
  users: [],
  pendingMarketers: [],
  distributors: [],
  selectedUser: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  setUsers:            (users)        => set({ users }),
  setPendingMarketers: (pendingMarketers) => set({ pendingMarketers }),
  setDistributors:     (distributors) => set({ distributors }),
  setSelectedUser:     (selectedUser) => set({ selectedUser }),
  setLoading:          (isLoading)    => set({ isLoading }),
  setActionLoading:    (isActionLoading) => set({ isActionLoading }),
  setError:            (error)        => set({ error }),

  updateUserInList: (updated) => {
    set({
      users: get().users.map((u) => (u.id === updated.id ? updated : u)),
      pendingMarketers: get().pendingMarketers.filter((u) => u.id !== updated.id),
    })
  },

  removeUserFromList: (id) => {
    set({
      users: get().users.filter((u) => u.id !== id),
      pendingMarketers: get().pendingMarketers.filter((u) => u.id !== id),
    })
  },
}))
