import { ROLES, type Role } from '@/constants/roles'

/**
 * Returns the home dashboard path for a given role.
 * Used after login to redirect the user to the correct area.
 */
export function getRoleHomePath(role: Role | string | undefined): string {
  switch (role) {
    case ROLES.DEV:
      return '/dev/dashboard'
    case ROLES.ADMIN:
      return '/admin/dashboard'
    case ROLES.MARKETING_LEAD:
      return '/marketing-lead/dashboard'
    case ROLES.DISTRIBUTOR:
      return '/distributor/dashboard'
    case ROLES.MARKETER:
      return '/marketer/dashboard'
    default:
      return '/dashboard'
  }
}

/**
 * Returns true if the user's roles include at least one of the allowed roles.
 */
export function hasAnyRole(userRoles: string[], allowedRoles: Role[]): boolean {
  return userRoles.some((r) => allowedRoles.includes(r as Role))
}
