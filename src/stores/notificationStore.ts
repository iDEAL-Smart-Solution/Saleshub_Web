import { create } from 'zustand'
import type { NotificationResponse } from '@/types'

interface NotificationStore {
  notifications: NotificationResponse[]
  unreadCount: number
  totalCount: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null

  setNotifications: (items: NotificationResponse[], totalCount: number, page: number, totalPages: number) => void
  setUnreadCount:   (count: number)              => void
  setLoading:       (v: boolean)                 => void
  setError:         (e: string | null)           => void
  markRead:         (id: string)                 => void
  markAllRead:      ()                           => void
  decrementUnread:  (by?: number)                => void
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  setNotifications: (items, totalCount, page, totalPages) =>
    set({ notifications: items, totalCount, currentPage: page, totalPages }),

  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setLoading:     (isLoading)   => set({ isLoading }),
  setError:       (error)       => set({ error }),

  markRead: (id) => {
    const wasUnread = get().notifications.some((n) => n.id === id && !n.isRead)
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n,
      ),
      unreadCount: wasUnread
        ? Math.max(0, get().unreadCount - 1)
        : get().unreadCount,
    })
  },

  markAllRead: () => {
    set({
      notifications: get().notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt ?? new Date().toISOString(),
      })),
      unreadCount: 0,
    })
  },

  decrementUnread: (by = 1) =>
    set({ unreadCount: Math.max(0, get().unreadCount - by) }),
}))
