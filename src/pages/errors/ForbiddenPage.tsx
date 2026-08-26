import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { Button } from '@/components/common'
import { useAuthStore } from '@/stores/authStore'
import { getRoleHomePath } from '@/features/auth/utils/roleRedirect'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  // RoleRoute passes the user's home as location state
  const homeFromState = (location.state as { home?: string } | null)?.home
  const home = homeFromState ?? (user ? getRoleHomePath(user.roles[0]) : '/login')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center mb-6">
        <ShieldOff size={36} className="text-[#D32F2F]" />
      </div>
      <h1 className="text-6xl font-bold text-[#D32F2F] mb-2">403</h1>
      <h2 className="text-xl font-semibold text-[#212121] mb-2">Access denied</h2>
      <p className="text-sm text-[#757575] max-w-sm mb-8">
        You do not have permission to view this page. Contact your administrator if
        you believe this is a mistake.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
        <Button onClick={() => navigate(home, { replace: true })}>My dashboard</Button>
      </div>
    </div>
  )
}
