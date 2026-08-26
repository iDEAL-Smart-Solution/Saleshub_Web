import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/types'
import type { NotificationResponse } from '@/types'

function makeNote(id: string, isRead = false): NotificationResponse {
  return {
    id, type: NotificationType.System,
    title: 'Test', message: 'Hello',
    isRead, createdAt: '2026-08-01T00:00:00Z',
  }
}

describe('notificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [], unreadCount: 0, totalCount: 0,
      currentPage: 1, totalPages: 1, isLoading: false, error: null,
    })
  })

  it('setNotifications stores items and metadata', () => {
    useNotificationStore.getState().setNotifications([makeNote('n1'), makeNote('n2')], 10, 1, 2)
    const s = useNotificationStore.getState()
    expect(s.notifications).toHaveLength(2)
    expect(s.totalCount).toBe(10)
    expect(s.totalPages).toBe(2)
  })

  it('setUnreadCount sets the badge count', () => {
    useNotificationStore.getState().setUnreadCount(5)
    expect(useNotificationStore.getState().unreadCount).toBe(5)
  })

  it('markRead marks a notification as read and decrements unreadCount', () => {
    useNotificationStore.getState().setNotifications([makeNote('n1', false)], 1, 1, 1)
    useNotificationStore.getState().setUnreadCount(3)
    useNotificationStore.getState().markRead('n1')

    const s = useNotificationStore.getState()
    expect(s.notifications[0].isRead).toBe(true)
    expect(s.unreadCount).toBe(2)
  })

  it('markRead on already-read notification does not decrement count', () => {
    useNotificationStore.getState().setNotifications([makeNote('n1', true)], 1, 1, 1)
    useNotificationStore.getState().setUnreadCount(2)
    useNotificationStore.getState().markRead('n1')
    expect(useNotificationStore.getState().unreadCount).toBe(2)
  })

  it('markAllRead marks all as read and zeroes unreadCount', () => {
    useNotificationStore.getState().setNotifications(
      [makeNote('n1'), makeNote('n2'), makeNote('n3', true)], 3, 1, 1,
    )
    useNotificationStore.getState().setUnreadCount(2)
    useNotificationStore.getState().markAllRead()

    const s = useNotificationStore.getState()
    expect(s.notifications.every((n) => n.isRead)).toBe(true)
    expect(s.unreadCount).toBe(0)
  })

  it('unreadCount never goes below zero', () => {
    useNotificationStore.getState().setUnreadCount(0)
    useNotificationStore.getState().decrementUnread(5)
    expect(useNotificationStore.getState().unreadCount).toBe(0)
  })
})
