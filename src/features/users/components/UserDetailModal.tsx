import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import UserStatusBadge from './UserStatusBadge'
import { LoadingState } from '@/components/feedback'
import type { UserResponse } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  user: UserResponse | null
  isLoading: boolean
  onActivate?: (id: string) => void
  onDeactivate?: (id: string) => void
  /** Called when the user is a pending self-registered Marketer — routes to the approve+assign flow. */
  onApprove?: (id: string) => void
  isActionLoading?: boolean
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-2 border-b border-[#F5F5F5] last:border-0">
      <span className="text-xs font-medium text-[#757575] uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#212121]">{value || '—'}</span>
    </div>
  )
}

export default function UserDetailModal({
  isOpen, onClose, user, isLoading, onActivate, onDeactivate, onApprove, isActionLoading,
}: Props) {
  // A pending self-registered marketer is inactive and has the Marketer role.
  // Activating them requires a distributor assignment — route through the approve flow.
  const isPendingMarketer =
    user !== null && !user.isActive && user.roles.includes('Marketer')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="lg"
      footer={
        user && (
          <div className="flex items-center gap-2 w-full justify-between">
            <UserStatusBadge user={user} />
            <div className="flex gap-2">
              {user.isActive && onDeactivate && (
                <Button
                  size="sm" variant="danger"
                  isLoading={isActionLoading}
                  onClick={() => onDeactivate(user.id)}
                >
                  Deactivate
                </Button>
              )}

              {/* Pending marketer — must go through approve+assign flow */}
              {isPendingMarketer && onApprove && (
                <Button
                  size="sm"
                  isLoading={isActionLoading}
                  onClick={() => onApprove(user.id)}
                >
                  Approve & assign distributor
                </Button>
              )}

              {/* Non-marketer inactive users — plain activate is fine */}
              {!user.isActive && !isPendingMarketer && onActivate && (
                <Button
                  size="sm" variant="secondary"
                  isLoading={isActionLoading}
                  onClick={() => onActivate(user.id)}
                >
                  Activate
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        )
      }
    >
      {isLoading ? (
        <LoadingState message="Loading user details…" />
      ) : user ? (
        <div>
          {/* Roles */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {user.roles.map((r) => (
              <Badge key={r} variant="primary">{r}</Badge>
            ))}
          </div>

          <Row label="First name"     value={user.firstName} />
          <Row label="Last name"      value={user.lastName} />
          <Row label="Email"          value={user.email} />
          <Row label="Phone"          value={user.phoneNumber} />
          <Row label="WhatsApp"       value={user.whatsAppNumber} />
          <Row label="State"          value={user.state} />
          <Row label="City"           value={user.city} />
          <Row label="Address"        value={user.houseAddress} />
          {user.roles.includes('Marketer') && (
            <Row label="Distributor" value={user.distributorName ?? 'Not assigned'} />
          )}
          <Row label="Created"        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined} />
          <Row label="Last login"     value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : undefined} />
          <Row label="Last modified"  value={user.lastModifiedAt ? new Date(user.lastModifiedAt).toLocaleString() : undefined} />
        </div>
      ) : (
        <p className="text-sm text-[#757575]">No user selected.</p>
      )}
    </Modal>
  )
}
