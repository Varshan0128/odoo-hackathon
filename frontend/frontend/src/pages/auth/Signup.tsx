import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'
import type { Role } from '@/types'

export function SignUp() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('employee')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Full name is required.'
    if (!employeeId.trim()) next.employeeId = 'Employee ID is required.'
    if (!email.trim()) next.email = 'Work email is required.'
    if (password.length < 8) next.password = 'Password must be at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = signUp({ name, employeeId, email, role })
      setLoading(false)
      if (!result.ok) {
        setErrors({ email: result.error ?? 'Something went wrong.' })
        return
      }
      toast('Account created. A verification email has been sent.')
      navigate('/dashboard')
    }, 500)
  }

  return (
    <AuthLayout>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">Create your account</h1>
      <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">Set up access to your organization's Dayflow workspace.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <Input label="Full name" name="name" placeholder="Jordan Lee" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Employee ID"
            name="employeeId"
            placeholder="DF-1007"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            error={errors.employeeId}
          />
          <Select label="Role" name="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="employee">Employee</option>
            <option value="admin">HR</option>
          </Select>
        </div>
        <Input
          label="Work email"
          type="email"
          name="email"
          placeholder="you@dayflow.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint={!errors.password ? 'Use at least 8 characters.' : undefined}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
        Already have an account?{' '}
        <Link to="/signin" className="font-medium text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
