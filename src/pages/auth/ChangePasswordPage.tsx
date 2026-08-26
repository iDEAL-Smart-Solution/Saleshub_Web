import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button, Input, PageHeader } from '@/components/common'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/

const schema = z
  .object({
    currentPassword:  z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(PASSWORD_REGEX, 'Must include uppercase, lowercase, number, and special character'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ChangePasswordPage() {
  usePageTitle('Change Password')
  const { changePassword, isLoading, error, clearError } = useAuth()
  const [success, setSuccess] = useState(false)
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    clearError()
    const ok = await changePassword(data)
    if (ok) {
      setSuccess(true)
      reset()
    }
  }

  const toggle = (field: keyof typeof show) =>
    setShow((v) => ({ ...v, [field]: !v[field] }))

  return (
    <div className="max-w-md">
      <PageHeader title="Change Password" subtitle="Update your account password" />

      {success && (
        <div role="status" className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9]">
          <CheckCircle size={16} className="text-[#2E7D32] shrink-0 mt-0.5" />
          <p className="text-sm text-[#1B5E20]">Password changed successfully.</p>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]">
          <AlertCircle size={16} className="text-[#D32F2F] shrink-0 mt-0.5" />
          <p className="text-sm text-[#C62828]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Current password"
          required
          type={show.current ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          rightAddon={
            <button type="button" tabIndex={-1} aria-label={show.current ? 'Hide' : 'Show'}
              onClick={() => toggle('current')}
              className="text-[#757575] hover:text-[#1565C0] transition-colors">
              {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('currentPassword')}
        />

        <Input
          label="New password"
          required
          type={show.newPw ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Min 8 chars, uppercase, lowercase, number, special character"
          error={errors.newPassword?.message}
          rightAddon={
            <button type="button" tabIndex={-1} aria-label={show.newPw ? 'Hide' : 'Show'}
              onClick={() => toggle('newPw')}
              className="text-[#757575] hover:text-[#1565C0] transition-colors">
              {show.newPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('newPassword')}
        />

        <Input
          label="Confirm new password"
          required
          type={show.confirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmNewPassword?.message}
          rightAddon={
            <button type="button" tabIndex={-1} aria-label={show.confirm ? 'Hide' : 'Show'}
              onClick={() => toggle('confirm')}
              className="text-[#757575] hover:text-[#1565C0] transition-colors">
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('confirmNewPassword')}
        />

        <Button type="submit" isLoading={isLoading} loadingText="Saving…" className="mt-2">
          Change password
        </Button>
      </form>
    </div>
  )
}
