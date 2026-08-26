import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type { PagedNotificationResponse } from '@/types'

export interface NotificationListParams {
  page?: number
  pageSize?: number
}

/** GET /api/notifications?page&pageSize — all notifications for current user */
export async function getNotificationsApi(params: NotificationListParams = {}): Promise<PagedNotificationResponse> {
  try {
    return (await apiClient.get<PagedNotificationResponse>('/notifications', { params })).data
  } catch (e) { throw normalizeApiError(e) }
}

/** GET /api/notifications/unread?page&pageSize */
export async function getUnreadNotificationsApi(params: NotificationListParams = {}): Promise<PagedNotificationResponse> {
  try {
    return (await apiClient.get<PagedNotificationResponse>('/notifications/unread', { params })).data
  } catch (e) { throw normalizeApiError(e) }
}

/** POST /api/notifications/{id}/read */
export async function markNotificationReadApi(id: string): Promise<void> {
  try { await apiClient.post(`/notifications/${id}/read`) }
  catch (e) { throw normalizeApiError(e) }
}

/** POST /api/notifications/read-all */
export async function markAllNotificationsReadApi(): Promise<void> {
  try { await apiClient.post('/notifications/read-all') }
  catch (e) { throw normalizeApiError(e) }
}
