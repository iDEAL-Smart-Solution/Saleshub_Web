// ── Enums as const objects (TypeScript 6 erasableSyntaxOnly-compatible) ──────
// These match the backend integer values exactly.

export const SaleStatus = {
  Pending:   0,
  Confirmed: 1,
  Rejected:  2,
  Refunded:  3,
} as const
export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus]

export const CommissionStatus = {
  Pending:   0,
  Approved:  1,
  Paid:      2,
  Adjusted:  3,
  Cancelled: 4,
} as const
export type CommissionStatus = (typeof CommissionStatus)[keyof typeof CommissionStatus]

export const CommissionType = {
  KpiReward:  0,
  Bonus:      1,
  Adjustment: 2,
} as const
export type CommissionType = (typeof CommissionType)[keyof typeof CommissionType]

export const NotificationType = {
  KpiAchieved:      0,
  KpiReminder:      1,
  CommissionEarned: 2,
  System:           3,
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const PerformanceSaleType = {
  CarriedForward:  0,
  CurrentMonthKpi: 1,
  Bonus:           2,
} as const
export type PerformanceSaleType = (typeof PerformanceSaleType)[keyof typeof PerformanceSaleType]

// ── Products ─────────────────────────────────────────────────────────────────

export interface ProductResponse {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  deactivatedAt?: string | null
  createdAt: string
  lastModifiedAt?: string | null
}

export interface CreateProductRequest {
  name: string
  description?: string
}

export type UpdateProductRequest = CreateProductRequest

// ── Customers ────────────────────────────────────────────────────────────────

export interface CustomerResponse {
  id: string
  name: string
  contactPerson?: string | null
  email?: string | null
  phoneNumber?: string | null
  address?: string | null
  isActive: boolean
  createdAt: string
  lastModifiedAt?: string | null
}

export interface CreateCustomerRequest {
  name: string
  contactPerson?: string
  email?: string
  phoneNumber?: string
  address?: string
}

export type UpdateCustomerRequest = CreateCustomerRequest

// ── Sales ────────────────────────────────────────────────────────────────────

export interface SaleSummaryResponse {
  id: string
  marketerName: string
  customerName: string
  productName: string
  saleDate: string
  amount: number
  status: SaleStatus
  createdAt: string
}

export interface SaleResponse {
  id: string
  marketerId: string
  marketerName: string
  customerId: string
  customerName: string
  productId: string
  productName: string
  saleDate: string
  amount: number
  status: SaleStatus
  recordedById: string
  recordedByName: string
  confirmedAt?: string | null
  confirmedById?: string | null
  confirmedByName?: string | null
  refundedAt?: string | null
  createdAt: string
  lastModifiedAt?: string | null
}

export interface CreateSaleRequest {
  marketerId: string
  customerId: string
  productId: string
  saleDate: string
  amount: number
}

export interface RejectSaleRequest {
  reason?: string
}

// ── KPI ──────────────────────────────────────────────────────────────────────

export interface KpiPeriodResponse {
  id: string
  year: number
  month: number
  targetSales: number
  isActive: boolean
  createdAt: string
  lastModifiedAt?: string | null
}

export interface CreateKpiPeriodRequest {
  year: number
  month: number
  targetSales: number
}

export interface UpdateKpiPeriodRequest {
  targetSales: number
}

// ── Performance ───────────────────────────────────────────────────────────────

export interface MonthlyPerformanceResponse {
  id: string
  marketerId: string
  marketerName: string
  year: number
  month: number
  kpiTarget: number
  carriedSales: number
  newSales: number
  totalKpiProgress: number
  performancePercentage: number
  isKpiMet: boolean
  kpiMetAt?: string | null
  bonusSalesCount: number
  kpiReward: number
  bonusCommission: number
  totalCommission: number
  isClosed: boolean
  closedAt?: string | null
  createdAt: string
  lastModifiedAt?: string | null
}

export interface MonthlyPerformanceSummary {
  year: number
  month: number
  kpiTarget: number
  carriedSales: number
  newSales: number
  totalKpiProgress: number
  performancePercentage: number
  isKpiMet: boolean
  bonusSalesCount: number
  kpiReward: number
  bonusCommission: number
  totalCommission: number
}

export interface PerformanceComparisonResponse {
  periodA: MonthlyPerformanceSummary
  periodB: MonthlyPerformanceSummary
}

// ── Commissions ───────────────────────────────────────────────────────────────

export interface CommissionResponse {
  id: string
  marketerId: string
  marketerName: string
  monthlyPerformanceId: string
  performanceYear: number
  performanceMonth: number
  saleId?: string | null
  type: CommissionType
  amount: number
  status: CommissionStatus
  description?: string | null
  earnedAt: string
  paidAt?: string | null
  createdAt: string
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

export interface PagedNotificationResponse {
  items: NotificationResponse[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
