import Badge from '@/components/common/Badge'
import type { UserSummaryResponse } from '@/types'

interface Props {
  user: Pick<UserSummaryResponse, 'isActive'>
  isPending?: boolean
}

export default function UserStatusBadge({ user, isPending = false }: Props) {
  if (isPending) {
    return <Badge variant="warning" dot>Pending Approval</Badge>
  }
  if (user.isActive) {
    return <Badge variant="success" dot>Active</Badge>
  }
  return <Badge variant="neutral" dot>Inactive</Badge>
}
