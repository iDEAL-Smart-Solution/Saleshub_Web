import Badge from '@/components/common/Badge'

export default function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return <Badge variant={isActive ? 'success' : 'neutral'} dot>{isActive ? 'Active' : 'Inactive'}</Badge>
}
