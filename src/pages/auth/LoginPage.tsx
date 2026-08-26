import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button, Input } from '@/components/common'

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  usePageTitle('Sign in')
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    clearError()
    await login(data)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#212121] mb-1">Welcome back</h2>
      <p className="text-sm text-[#757575] mb-8">
        Sign in to your iDEAL SalesHub account
      </p>

      {/* Backend error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]"
        >
          <AlertCircle size={16} className="text-[#D32F2F] shrink-0 mt-0.5" />
          <p className="text-sm text-[#C62828]">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Sign in form"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              rightAddon={
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[#757575] hover:text-[#1565C0] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="Signing in…"
            leftIcon={<LogIn size={16} />}
            className="mt-2"
          >
            Sign in
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[#757575]">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-[#1565C0] font-medium hover:underline"
        >
          Register as a marketer
        </Link>
      </p>
    </div>
  )
}
