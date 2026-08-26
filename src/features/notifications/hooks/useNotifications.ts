import { useCallback } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'
import {
  getNotificationsApi,
  getUnreadNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from '@/services/api/notification.service'
import { normalizeApiError } from '@/services/api/errorHandler'

export function useNotifications() {
  const store = useNotificationStore()

  // NOTE: Callbacks read actions/state via `useNotificationStore.getState()` and
  // declare `[]` deps so their identity is stable across renders. Depending on the
  // subscribed `store` object here would give every callback a new identity on each
  // store update, which — when a callback is used in a `useEffect` dep array — creates
  // an infinite render loop ("Maximum update depth exceeded").

  /** Fetch a page of all notifications */
  const fetchNotifications = useCallback(
    async (page = 1, pageSize = 20) => {
      const s = useNotificationStore.getState()
      s.setLoading(true)
      s.setError(null)
      try {
        const res = await getNotificationsApi({ page, pageSize })
        s.setNotifications(res.items, res.totalCount, res.page, res.totalPages)
      } catch (e) {
        s.setError(normalizeApiError(e).message)
      } finally {
        s.setLoading(false)
      }
    },
    [],
  )

  /** Fetch unread count only (lightweight poll for header badge) */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await getUnreadNotificationsApi({ page: 1, pageSize: 1 })
      useNotificationStore.getState().setUnreadCount(res.totalCount)
    } catch {
      // Silently ignore — badge count is non-critical
    }
  }, [])

  /** Fetch first page of unread notifications */
  const fetchUnread = useCallback(
    async (page = 1, pageSize = 20) => {
      const s = useNotificationStore.getState()
      s.setLoading(true)
      s.setError(null)
      try {
        const res = await getUnreadNotificationsApi({ page, pageSize })
        s.setNotifications(res.items, res.totalCount, res.page, res.totalPages)
        s.setUnreadCount(res.totalCount)
      } catch (e) {
        s.setError(normalizeApiError(e).message)
      } finally {
        s.setLoading(false)
      }
    },
    [],
  )

  const markRead = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await markNotificationReadApi(id)
        useNotificationStore.getState().markRead(id)
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const markAllRead = useCallback(async (): Promise<boolean> => {
    try {
      await markAllNotificationsReadApi()
      useNotificationStore.getState().markAllRead()
      return true
    } catch {
      return false
    }
  }, [])

  return {
    notifications:    store.notifications,
    unreadCount:      store.unreadCount,
    totalCount:       store.totalCount,
    currentPage:      store.currentPage,
    totalPages:       store.totalPages,
    isLoading:        store.isLoading,
    error:            store.error,
    fetchNotifications,
    fetchUnreadCount,
    fetchUnread,
    markRead,
    markAllRead,
    clearError:       () => useNotificationStore.getState().setError(null),
  }
}
