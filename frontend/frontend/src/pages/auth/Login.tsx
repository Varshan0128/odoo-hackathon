import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

export function SignIn() {
  const { signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = signIn(email, password)
      setLoading(false)
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong. Try again.')
        return
      }
      toast('Signed in successfully.')
      navigate('/dashboard')
    }, 400)
  }

  return (
    <AuthLayout>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">Welcome back</h1>
      <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">Sign in to your Dayflow workspace.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <Input
          label="Work email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@dayflow.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="mt-5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)]/60 p-3 text-xs text-[var(--color-ink-muted)]">
        Demo access — use <strong className="text-[var(--color-ink)]">ananya.rao@dayflow.io</strong> for HR, or{' '}
        <strong className="text-[var(--color-ink)]">rohan.mehta@dayflow.io</strong> for an employee view. Any
        password works while the backend is in progress.
      </div>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
        New to Dayflow?{' '}
        <Link to="/signup" className="font-medium text-[var(--color-primary)] hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
