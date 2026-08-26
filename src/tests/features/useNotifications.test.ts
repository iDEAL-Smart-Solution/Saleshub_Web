import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/types'
import type { PagedNotificationResponse } from '@/types'

vi.mock('@/services/api/notification.service', () => ({
  getNotificationsApi:       vi.fn(),
  getUnreadNotificationsApi: vi.fn(),
  markNotificationReadApi:   vi.fn(),
  markAllNotificationsReadApi: vi.fn(),
}))

import * as notifService from '@/services/api/notification.service'

const pagedResponse: PagedNotificationResponse = {
  items: [
    { id: 'n1', type: NotificationType.KpiAchieved, title: 'KPI Met!',
      message: 'Congrats', isRead: false, createdAt: '2026-08-01T00:00:00Z' },
    { id: 'n2', type: NotificationType.System, title: 'System',
      message: 'Update', isRead: true, createdAt: '2026-08-02T00:00:00Z' },
  ],
  totalCount: 2, page: 1, pageSize: 20, totalPages: 1,
}

describe('useNotifications hook', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [], unreadCount: 0, totalCount: 0,
      currentPage: 1, totalPages: 1, isLoading: false, error: null,
    })
    vi.clearAllMocks()
  })

  it('fetchNotifications stores items and metadata', async () => {
    vi.mocked(notifService.getNotificationsApi).mockResolvedValue(pagedResponse)
    const { result } = renderHook(() => useNotifications())

    await act(async () => { await result.current.fetchNotifications() })

    expect(result.current.notifications).toHaveLength(2)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it('fetchUnreadCount sets unread count without loading the list', async () => {
    vi.mocked(notifService.getUnreadNotificationsApi).mockResolvedValue({
      ...pagedResponse, totalCount: 5, items: [],
    })
    const { result } = renderHook(() => useNotifications())

    await act(async () => { await result.current.fetchUnreadCount() })

    expect(result.current.unreadCount).toBe(5)
  })

  it('markRead calls API and updates store', async () => {
    vi.mocked(notifService.markNotificationReadApi).mockResolvedValue(undefined)
    useNotificationStore.getState().setNotifications(
      [{ id: 'n1', type: NotificationType.System, title: 'T', message: 'M',
         isRead: false, createdAt: '2026-08-01T00:00:00Z' }],
      1, 1, 1,
    )
    useNotificationStore.getState().setUnreadCount(1)
    const { result } = renderHook(() => useNotifications())

    await act(async () => { await result.current.markRead('n1') })

    expect(result.current.notifications[0].isRead).toBe(true)
    expect(result.current.unreadCount).toBe(0)
  })

  it('markAllRead calls API and zeros count', async () => {
    vi.mocked(notifService.markAllNotificationsReadApi).mockResolvedValue(undefined)
    useNotificationStore.getState().setUnreadCount(3)
    const { result } = renderHook(() => useNotifications())

    await act(async () => { await result.current.markAllRead() })

    expect(result.current.unreadCount).toBe(0)
  })

  it('fetchNotifications sets error on failure', async () => {
    vi.mocked(notifService.getNotificationsApi).mockRejectedValue(new Error('500'))
    const { result } = renderHook(() => useNotifications())

    await act(async () => { await result.current.fetchNotifications() })

    expect(result.current.error).not.toBeNull()
  })
})
