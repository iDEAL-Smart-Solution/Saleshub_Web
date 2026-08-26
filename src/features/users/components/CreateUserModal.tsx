import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/authStore'
import type { CreateUserRequest, Role } from '@/types'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/

const schema = z
  .object({
    firstName:    z.string().min(1, 'Required').max(100),
    lastName:     z.string().min(1, 'Required').max(100),
    email:        z.string().min(1, 'Required').email('Invalid email').max(256),
    phoneNumber:  z.string().max(20).optional().or(z.literal('')),
    whatsAppNumber: z.string().max(20).optional().or(z.literal('')),
    state:        z.string().max(100).optional().or(z.literal('')),
    city:         z.string().max(100).optional().or(z.literal('')),
    houseAddress: z.string().max(500).optional().or(z.literal('')),
    role:         z.string().min(1, 'Role is required'),
    password:     z.string().min(8, 'Min 8 characters').regex(PASSWORD_REGEX, 'Needs uppercase, lowercase, number, special char'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUserRequest) => Promise<boolean>
  isLoading: boolean
  error?: string | null
}

export default function CreateUserModal({ isOpen, onClose, onSubmit, isLoading, error }: Props) {
  const currentUserRole = useAuthStore((s) => s.user?.roles[0])
  const [showPw, setShowPw]  = useState(false)
  const [showCpw, setShowCpw] = useState(false)

  // Admins cannot create Dev accounts
  const availableRoles = currentUserRole === ROLES.DEV
    ? [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.MARKETER]
    : [ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.MARKETER]

  const roleOptions = availableRoles.map((r) => ({ label: r, value: r }))

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data: FormValues) => {
    const ok = await onSubmit({
      firstName:    data.firstName,
      lastName:     data.lastName,
      email:        data.email,
      phoneNumber:  data.phoneNumber  || undefined,
      whatsAppNumber: data.whatsAppNumber || undefined,
      state:        data.state        || undefined,
      city:         data.city         || undefined,
      houseAddress: data.houseAddress || undefined,
      role:         data.role as Role,
      password:     data.password,
      confirmPassword: data.confirmPassword,
    })
    if (ok) handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button form="create-user-form" type="submit" isLoading={isLoading} loadingText="Creating…">
            Create user
          </Button>
        </>
      }
    >
      {error && (
        <div role="alert" className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]">
          <AlertCircle size={15} className="text-[#D32F2F] shrink-0 mt-0.5" />
          <p className="text-sm text-[#C62828]">{error}</p>
        </div>
      )}

      <form id="create-user-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First name" required placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name"  required placeholder="Doe"  error={errors.lastName?.message}  {...register('lastName')}  />
          </div>

          <Input label="Email" type="email" required placeholder="user@example.com" error={errors.email?.message} {...register('email')} />

          <Select
            label="Role"
            required
            options={roleOptions}
            placeholder="Select a role…"
            error={errors.role?.message}
            {...register('role')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone number"    type="tel" placeholder="+234 800 000 0000" error={errors.phoneNumber?.message}    {...register('phoneNumber')}    />
            <Input label="WhatsApp number" type="tel" placeholder="+234 800 000 0000" error={errors.whatsAppNumber?.message} {...register('whatsAppNumber')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="State" placeholder="Lagos" error={errors.state?.message} {...register('state')} />
            <Input label="City"  placeholder="Ikeja" error={errors.city?.message}  {...register('city')}  />
          </div>

          <Input label="House address" placeholder="1 Main Street" error={errors.houseAddress?.message} {...register('houseAddress')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password" required type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              hint="Min 8 chars — upper, lower, number, symbol"
              error={errors.password?.message}
              rightAddon={
                <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                  className="text-[#757575] hover:text-[#1565C0]">
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              }
              {...register('password')}
            />
            <Input
              label="Confirm password" required type={showCpw ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              rightAddon={
                <button type="button" tabIndex={-1} onClick={() => setShowCpw(v => !v)}
                  className="text-[#757575] hover:text-[#1565C0]">
                  {showCpw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              }
              {...register('confirmPassword')}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
