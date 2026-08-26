import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/common'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#E3F2FD] flex items-center justify-center mb-6">
        <FileQuestion size={36} className="text-[#1565C0]" />
      </div>
      <h1 className="text-6xl font-bold text-[#1565C0] mb-2">404</h1>
      <h2 className="text-xl font-semibold text-[#212121] mb-2">Page not found</h2>
      <p className="text-sm text-[#757575] max-w-sm mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button onClick={() => navigate('/dashboard')}>
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
