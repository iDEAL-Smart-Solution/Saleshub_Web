import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type {
  UserResponse,
  UserSummaryResponse,
  MarketerSummaryResponse,
  CreateUserRequest,
  ChangeUserRoleRequest,
} from '@/types'

/**
 * GET /api/users
 * DevOrAdmin only. Returns list of all users.
 */
export async function getAllUsersApi(): Promise<UserSummaryResponse[]> {
  try {
    const res = await apiClient.get<UserSummaryResponse[]>('/users')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/marketers
 * MarketingLeadOrAbove. Returns all active Marketers (lightweight DTO).
 * Used to populate the marketer selector for sale recording and performance views.
 */
export async function getActiveMarketersApi(): Promise<MarketerSummaryResponse[]> {
  try {
    const res = await apiClient.get<MarketerSummaryResponse[]>('/users/marketers')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/:id
 * DevOrAdmin only. Returns full user details.
 */
export async function getUserByIdApi(id: string): Promise<UserResponse> {
  try {
    const res = await apiClient.get<UserResponse>(`/users/${id}`)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/pending-marketers
 * DevOrAdmin only. Returns users with IsActive=false pending approval.
 */
export async function getPendingMarketersApi(): Promise<UserSummaryResponse[]> {
  try {
    const res = await apiClient.get<UserSummaryResponse[]>('/users/pending-marketers')
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/users
 * DevOrAdmin only. Creates a user with an explicit role and password.
 */
export async function createUserApi(data: CreateUserRequest): Promise<UserResponse> {
  try {
    const res = await apiClient.post<UserResponse>('/users', data)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/users/:id/approve
 * DevOrAdmin only. Activates a pending marketer account.
 */
export async function approveMarketerApi(id: string): Promise<void> {
  try {
    await apiClient.post(`/users/${id}/approve`)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/users/:id/activate
 */
export async function activateUserApi(id: string): Promise<void> {
  try {
    await apiClient.post(`/users/${id}/activate`)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/users/:id/deactivate
 */
export async function deactivateUserApi(id: string): Promise<void> {
  try {
    await apiClient.post(`/users/${id}/deactivate`)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * PATCH /api/users/:id/role
 */
export async function changeUserRoleApi(id: string, data: ChangeUserRoleRequest): Promise<void> {
  try {
    await apiClient.patch(`/users/${id}/role`, data)
  } catch (err) {
    throw normalizeApiError(err)
  }
}
