import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button, Input } from '@/components/common'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/

const schema = z
  .object({
    firstName:    z.string().min(1, 'First name is required').max(100),
    lastName:     z.string().min(1, 'Last name is required').max(100),
    email:        z.string().min(1, 'Email is required').email('Enter a valid email').max(256),
    phoneNumber:  z.string().max(20).optional().or(z.literal('')),
    whatsAppNumber: z.string().max(20).optional().or(z.literal('')),
    state:        z.string().max(100).optional().or(z.literal('')),
    city:         z.string().max(100).optional().or(z.literal('')),
    houseAddress: z.string().max(500).optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        PASSWORD_REGEX,
        'Password must include uppercase, lowercase, number, and special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  usePageTitle('Register')
  const { register: registerMarketer, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    clearError()
    const ok = await registerMarketer({
      firstName:    data.firstName,
      lastName:     data.lastName,
      email:        data.email,
      phoneNumber:  data.phoneNumber  || undefined,
      whatsAppNumber: data.whatsAppNumber || undefined,
      state:        data.state        || undefined,
      city:         data.city         || undefined,
      houseAddress: data.houseAddress || undefined,
      password:     data.password,
      confirmPassword: data.confirmPassword,
    })
    if (ok) navigate('/pending-approval', { replace: true })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#212121] mb-1">Create account</h2>
      <p className="text-sm text-[#757575] mb-6">
        Register as a marketer — your account will need administrator approval before you can sign in.
      </p>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]"
        >
          <AlertCircle size={16} className="text-[#D32F2F] shrink-0 mt-0.5" />
          <p className="text-sm text-[#C62828]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Registration form">
        <div className="flex flex-col gap-4">

          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First name" required placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name"  required placeholder="Doe"  error={errors.lastName?.message}  {...register('lastName')}  />
          </div>

          <Input
            label="Email address"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone number"    type="tel" placeholder="+234 800 000 0000" error={errors.phoneNumber?.message}    {...register('phoneNumber')}    />
            <Input label="WhatsApp number" type="tel" placeholder="+234 800 000 0000" error={errors.whatsAppNumber?.message} {...register('whatsAppNumber')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="State" placeholder="Lagos"  error={errors.state?.message} {...register('state')} />
            <Input label="City"  placeholder="Ikeja"  error={errors.city?.message}  {...register('city')}  />
          </div>

          <Input
            label="House address"
            placeholder="1 Main Street, Lagos"
            error={errors.houseAddress?.message}
            {...register('houseAddress')}
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            hint="Min 8 chars with uppercase, lowercase, number and special character"
            error={errors.password?.message}
            rightAddon={
              <button type="button" tabIndex={-1} aria-label={showPassword ? 'Hide' : 'Show'}
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#757575] hover:text-[#1565C0] transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
          />

          <Input
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            rightAddon={
              <button type="button" tabIndex={-1} aria-label={showConfirm ? 'Hide' : 'Show'}
                onClick={() => setShowConfirm((v) => !v)}
                className="text-[#757575] hover:text-[#1565C0] transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="Registering…"
            leftIcon={<UserPlus size={16} />}
            className="mt-2"
          >
            Create account
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[#757575]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1565C0] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
