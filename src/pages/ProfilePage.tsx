import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Card, PageHeader, Badge, Button } from '@/components/common'
import UserStatusBadge from '@/features/users/components/UserStatusBadge'

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3 border-b border-[#F5F5F5] last:border-0">
      <span className="text-xs font-semibold text-[#757575] uppercase tracking-wide col-span-1">
        {label}
      </span>
      <span className="text-sm text-[#212121] col-span-2">{value || '—'}</span>
    </div>
  )
}

export default function ProfilePage() {
  usePageTitle('My Profile')
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <div className="max-w-2xl">
      <PageHeader title="My Profile" subtitle="Your account information" />

      <Card>
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#EEEEEE]">
          <div className="w-14 h-14 rounded-full bg-[#1565C0] text-white text-lg font-bold
            flex items-center justify-center shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#212121]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-[#757575]">{user.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {user.roles.map((r) => (
                <Badge key={r} variant="primary" size="sm">{r}</Badge>
              ))}
              {/* isActive not on UserAuthInfo — show generic active badge */}
              <UserStatusBadge user={{ isActive: true }} />
            </div>
          </div>
        </div>

        {/* Details */}
        <Row label="First name" value={user.firstName} />
        <Row label="Last name"  value={user.lastName}  />
        <Row label="Email"      value={user.email}     />
        <Row label="User ID"    value={user.id}        />

        {/* ⚠️ Note: The UserAuthInfo returned by the backend at login only contains
            Id, FirstName, LastName, Email, Roles.
            Extended profile fields (phone, address, etc.) would require a GET /api/users/:id
            call, which requires DevOrAdmin policy. Displaying what is available from auth token. */}
        <p className="mt-4 text-xs text-[#9E9E9E]">
          To view full profile details, contact your administrator.
        </p>

        {/* Actions */}
        <div className="mt-6 pt-5 border-t border-[#EEEEEE]">
          <Link to="/profile/change-password" className="inline-block">
            <Button variant="secondary" leftIcon={<KeyRound size={15} />}>
              Change password
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
