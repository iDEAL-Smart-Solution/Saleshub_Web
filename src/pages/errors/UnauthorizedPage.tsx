import { useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { Button } from '@/components/common'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-6">
        <LockKeyhole size={36} className="text-[#E65100]" />
      </div>
      <h1 className="text-6xl font-bold text-[#E65100] mb-2">401</h1>
      <h2 className="text-xl font-semibold text-[#212121] mb-2">Session expired</h2>
      <p className="text-sm text-[#757575] max-w-sm mb-8">
        Your session has expired or you are not logged in. Please sign in to continue.
      </p>
      <Button onClick={() => navigate('/login')}>
        Sign in
      </Button>
    </div>
  )
}
