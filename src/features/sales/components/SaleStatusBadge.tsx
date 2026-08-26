import Badge from '@/components/common/Badge'
import { SaleStatus } from '@/types'
import { getSaleStatusLabel } from '@/utils/formatters'

interface Props { status: SaleStatus }

export default function SaleStatusBadge({ status }: Props) {
  if (status === SaleStatus.Confirmed) return <Badge variant="success" dot>{getSaleStatusLabel(status)}</Badge>
  if (status === SaleStatus.Rejected)  return <Badge variant="danger"  dot>{getSaleStatusLabel(status)}</Badge>
  if (status === SaleStatus.Refunded)  return <Badge variant="neutral" dot>{getSaleStatusLabel(status)}</Badge>
  return <Badge variant="warning" dot>{getSaleStatusLabel(status)}</Badge>
}
