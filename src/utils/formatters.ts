import { SaleStatus, CommissionType, CommissionStatus, NotificationType } from '@/types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Format a number as Nigerian Naira: ₦50,000.00 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('NGN', '₦')
    .trim()
}

/** Format an ISO date string as "22 Aug 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Format an ISO datetime as "22 Aug 2026, 14:30" */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "January 2026" */
export function formatMonth(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1] ?? ''} ${year}`
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? ''
}

/** Format a decimal percentage: 66.67 → "66.67%" */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function getSaleStatusLabel(status: SaleStatus): string {
  if (status === SaleStatus.Pending)   return 'Pending'
  if (status === SaleStatus.Confirmed) return 'Confirmed'
  if (status === SaleStatus.Rejected)  return 'Rejected'
  if (status === SaleStatus.Refunded)  return 'Refunded'
  return 'Unknown'
}

export function getCommissionTypeLabel(type: CommissionType): string {
  if (type === CommissionType.KpiReward)     return 'KPI Reward'
  if (type === CommissionType.Bonus)         return 'Bonus'
  if (type === CommissionType.Adjustment)    return 'Adjustment'
  if (type === CommissionType.Distributor)   return 'Distributor (10%)'
  if (type === CommissionType.MarketingLead) return 'Marketing Lead (2%)'
  return 'Unknown'
}

export function getCommissionStatusLabel(status: CommissionStatus): string {
  if (status === CommissionStatus.Pending)   return 'Pending'
  if (status === CommissionStatus.Approved)  return 'Approved'
  if (status === CommissionStatus.Paid)      return 'Paid'
  if (status === CommissionStatus.Adjusted)  return 'Adjusted'
  if (status === CommissionStatus.Cancelled) return 'Cancelled'
  return 'Unknown'
}

export function getNotificationTypeLabel(type: NotificationType): string {
  if (type === NotificationType.KpiAchieved)      return 'KPI Achieved'
  if (type === NotificationType.KpiReminder)      return 'KPI Reminder'
  if (type === NotificationType.CommissionEarned) return 'Commission Earned'
  if (type === NotificationType.System)           return 'System'
  return 'Notification'
}

/** Build an array of {year, month} options going back N months from today */
export function buildMonthOptions(count = 12): Array<{ year: number; month: number; label: string }> {
  const options = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    options.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: formatMonth(d.getFullYear(), d.getMonth() + 1),
    })
  }
  return options
}
