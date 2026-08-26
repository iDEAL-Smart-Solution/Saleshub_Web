import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function PendingApprovalPage() {
  usePageTitle('Account Pending Approval')

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#FFF8E1] flex items-center justify-center">
          <Clock size={30} className="text-[#E65100]" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#212121] mb-3">
        Registration successful
      </h2>

      <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl px-6 py-5 mb-6 text-left">
        <p className="text-sm text-[#1565C0] font-semibold mb-1">
          Your account is awaiting approval
        </p>
        <p className="text-sm text-[#1976D2] leading-relaxed">
          Your marketer account has been created and is pending review by an
          administrator. You will be able to sign in once your account has been
          approved.
        </p>
      </div>

      <ul className="text-sm text-[#757575] text-left space-y-2 mb-8">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BDBDBD] shrink-0" />
          Your registration details have been received.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BDBDBD] shrink-0" />
          An administrator will review and approve your account.
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BDBDBD] shrink-0" />
          Once approved, you can sign in with your email and password.
        </li>
      </ul>

      <Link
        to="/login"
        className="inline-flex items-center justify-center w-full h-10 px-4 rounded-lg
          bg-[#1565C0] text-white text-sm font-medium
          hover:bg-[#1976D2] transition-colors"
      >
        Back to sign in
      </Link>
    </div>
  )
}
