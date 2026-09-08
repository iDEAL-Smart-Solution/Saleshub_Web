import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type {
  UserResponse,
  UserSummaryResponse,
  MarketerSummaryResponse,
  DistributorSummaryResponse,
  CreateUserRequest,
  ChangeUserRoleRequest,
  AssignDistributorRequest,
} from '@/types'

/**
 * GET /api/users
 * DevOrAdmin only. Returns list of all users.
 */
export async function getAllUsersApi(): Promise<UserSummaryResponse[]> {
  try {
    return (await apiClient.get<UserSummaryResponse[]>('/users')).data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/marketers
 * DistributorOrAbove.
 * - Distributor: returns only their assigned marketers (scoped server-side).
 * - MarketingLead/Admin/Dev: returns all active marketers.
 */
export async function getActiveMarketersApi(): Promise<MarketerSummaryResponse[]> {
  try {
    return (await apiClient.get<MarketerSummaryResponse[]>('/users/marketers')).data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/marketers/distributor/{distributorId}
 * MarketingLeadOrAbove. Returns marketers assigned to a specific distributor.
 */
export async function getMarketersByDistributorApi(
  distributorId: string,
): Promise<MarketerSummaryResponse[]> {
  try {
    return (
      await apiClient.get<MarketerSummaryResponse[]>(
        `/users/marketers/distributor/${distributorId}`,
      )
    ).data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * GET /api/users/distributors
 * MarketingLeadOrAbove. Returns all active Distributors.
 * Used to populate the distributor selector when creating a marketer.
 */
export async function getActiveDistributorsApi(): Promise<DistributorSummaryResponse[]> {
  try {
    return (await apiClient.get<DistributorSummaryResponse[]>('/users/distributors')).data
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
    return (await apiClient.get<UserResponse>(`/users/${id}`)).data
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
    return (await apiClient.get<UserSummaryResponse[]>('/users/pending-marketers')).data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/users
 * CanCreateMarketer (Admin/Dev/MarketingLead/Distributor).
 * Creates a user. When role=Marketer, distributorId is required (unless caller is Distributor).
 */
export async function createUserApi(data: CreateUserRequest): Promise<UserResponse> {
  try {
    return (await apiClient.post<UserResponse>('/users', data)).data
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

/** POST /api/users/:id/activate */
export async function activateUserApi(id: string): Promise<void> {
  try {
    await apiClient.post(`/users/${id}/activate`)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/** POST /api/users/:id/deactivate */
export async function deactivateUserApi(id: string): Promise<void> {
  try {
    await apiClient.post(`/users/${id}/deactivate`)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/** PATCH /api/users/:id/role */
export async function changeUserRoleApi(id: string, data: ChangeUserRoleRequest): Promise<void> {
  try {
    await apiClient.patch(`/users/${id}/role`, data)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * PATCH /api/users/:id/distributor
 * DevOrAdmin only. Reassigns a marketer to a different distributor.
 * Historical sales retain their original distributor snapshot.
 */
export async function reassignDistributorApi(
  marketerId: string,
  data: AssignDistributorRequest,
): Promise<void> {
  try {
    await apiClient.patch(`/users/${marketerId}/distributor`, data)
  } catch (err) {
    throw normalizeApiError(err)
  }
}
