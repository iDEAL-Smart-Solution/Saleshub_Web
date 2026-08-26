import Badge from '@/components/common/Badge'
import { CommissionStatus, type CommissionStatus as CommissionStatusType } from '@/types'
import { getCommissionStatusLabel } from '@/utils/formatters'

export default function CommissionStatusBadge({ status }: { status: CommissionStatusType }) {
  const variant = status === CommissionStatus.Paid ? 'success' : status === CommissionStatus.Cancelled ? 'danger' : status === CommissionStatus.Adjusted ? 'neutral' : status === CommissionStatus.Approved ? 'primary' : 'warning'
  return <Badge variant={variant} dot>{getCommissionStatusLabel(status)}</Badge>
}
