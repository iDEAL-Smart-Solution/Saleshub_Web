/**
 * Application role constants.
 * Use these instead of raw strings throughout the codebase.
 */
export const ROLES = {
  DEV: 'Dev',
  ADMIN: 'Admin',
  MARKETING_LEAD: 'MarketingLead',
  DISTRIBUTOR: 'Distributor',
  MARKETER: 'Marketer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Role hierarchy – higher index = higher privilege.
 * Useful for "at least" comparisons on the Admin/Dev/ML axis.
 * NOTE: Distributor is deliberately NOT inserted into this hierarchy.
 * Distributor has its own separate permissions and must be checked explicitly.
 * Using hasAtLeastRole for Distributor access is intentionally not supported.
 */
export const ROLE_HIERARCHY: Role[] = [
  ROLES.MARKETER,
  ROLES.MARKETING_LEAD,
  ROLES.ADMIN,
  ROLES.DEV,
]

/** Returns true if `role` has at least the same privilege as `minimum`. */
export function hasAtLeastRole(role: Role, minimum: Role): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum)
}
