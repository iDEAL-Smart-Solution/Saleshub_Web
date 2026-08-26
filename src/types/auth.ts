import type { Role } from '@/constants/roles'

// ── Matches backend UserAuthInfo (embedded in AuthResponse) ──────────────────
export interface UserAuthInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: Role[]
}

// ── Matches backend AuthResponse ─────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: string // ISO datetime
  user: UserAuthInfo
}

// ── Matches backend UserResponse (full detail view) ──────────────────────────
export interface UserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  whatsAppNumber?: string | null
  state?: string | null
  city?: string | null
  houseAddress?: string | null
  isActive: boolean
  createdAt: string
  lastModifiedAt?: string | null
  lastLoginAt?: string | null
  roles: Role[]
}

// ── Matches backend UserSummaryResponse (list view) ──────────────────────────
export interface UserSummaryResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  roles: Role[]
  createdAt: string
}

// ── Matches backend MarketerSummaryResponse ───────────────────────────────────
// Lightweight DTO returned by GET /api/users/marketers (MarketingLeadOrAbove).
// Does not expose roles array or creation date — callers already know role context.
export interface MarketerSummaryResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
}

// ── Auth store state shape ────────────────────────────────────────────────────
export interface AuthState {
  user: UserAuthInfo | null
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiry: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  error: string | null
}

// ── Request DTOs (mirror backend) ────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterMarketerRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  whatsAppNumber?: string
  state?: string
  city?: string
  houseAddress?: string
  password: string
  confirmPassword: string
}

export interface RefreshTokenRequest {
  accessToken: string
  refreshToken: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  whatsAppNumber?: string
  state?: string
  city?: string
  houseAddress?: string
  role: Role
  password: string
  confirmPassword: string
}

export interface ChangeUserRoleRequest {
  newRole: Role
}
