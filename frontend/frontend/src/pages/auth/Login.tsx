import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Users, PieChart, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

export function SignIn() {
  const { signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen bg-[#FBF7F2]">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] font-semibold text-white">D</div>
            <span className="text-lg font-semibold text-[#221711]">Dayflow</span>
          </div>

          <h1 className="text-[26px] font-semibold leading-tight text-[#221711]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#8A7F74]">Sign in to your Dayflow workspace.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <Field label="Work email">
              <IconInput
                icon={Mail}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@dayflow.io"
                value={email}
                onChange={setEmail}
              />
            </Field>

            <Field label="Password" error={error}>
              <IconInput
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                trailing={
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#B5AA9C] hover:text-[#8A7F74]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#221711]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D8CFC2] text-[#4A2F1F] focus:ring-[#4A2F1F]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-[#B8763F] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#EAE3D9]" />
            <span className="text-xs text-[#B5AA9C]">OR</span>
            <div className="h-px flex-1 bg-[#EAE3D9]" />
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#EAE3D9] bg-white py-3 text-sm font-medium text-[#221711] transition hover:bg-[#FBF7F2]">
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mt-5 flex gap-2.5 rounded-lg border border-[#EAE3D9] bg-[#F3ECE1] p-3.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#B8763F]" />
            <p className="text-xs leading-relaxed text-[#6B5F52]">
              Demo access — use <strong className="text-[#221711]">ananya.rao@dayflow.io</strong> for HR, or{' '}
              <strong className="text-[#221711]">rohan.mehta@dayflow.io</strong> for an employee view. Any password
              works while the backend is in progress.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-[#8A7F74]">
            New to Dayflow?{' '}
            <Link to="/signup" className="font-medium text-[#B8763F] hover:underline">
              Create an account →
            </Link>
          </p>
        </div>
      </div>

      {/* Right: marketing panel */}
      <div className="relative hidden overflow-hidden bg-[#1E140D] px-14 py-14 lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
        <span className="text-xs font-medium tracking-wide text-[#D9A566]">ODOO × NMIT BANGALORE 2026</span>
        <h2 className="mt-4 max-w-md text-[38px] font-semibold leading-[1.15] text-white">
          Every workday, <span className="text-[#D9A566]">perfectly aligned.</span>
        </h2>
        <div className="my-6 flex items-center gap-2">
          <div className="h-0.5 w-14 bg-gradient-to-r from-[#D9A566] to-transparent" />
          <span className="h-1 w-1 rounded-full bg-[#D9A566]" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-[#C9BEB2]">
          Attendance, leave, and payroll — one calm, connected home for how your organization actually runs.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <Feature icon={Users} title="People first" desc="Built for HR teams and employees." />
          <Feature icon={PieChart} title="All-in-one" desc="Attendance, leave, payroll, reports, and more." />
          <Feature icon={ShieldCheck} title="Smart & secure" desc="Powerful features with enterprise-grade security." />
        </div>

        <div className="mt-16 flex items-center gap-3 text-sm text-[#EDE7DF]">
          <span>People first.</span>
          <span className="h-1 w-1 rounded-full bg-[#D9A566]" />
          <span>Performance next.</span>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#221711]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function IconInput({
  icon: Icon,
  trailing,
  value,
  onChange,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>
  trailing?: React.ReactNode
  value: string
  onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#EAE3D9] bg-white px-3 py-2.5 focus-within:border-[#B8763F]">
      <Icon className="h-4 w-4 shrink-0 text-[#B5AA9C]" />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-[#221711] placeholder:text-[#B5AA9C] focus:outline-none"
      />
      {trailing}
    </div>
  )
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E1F15]">
        <Icon className="h-5 w-5 text-[#D9A566]" />
      </div>
      <p className="mt-3 text-[15px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#8A7F74]">{desc}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.6-5.1 3.6-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A11.8 11.8 0 0 0 12 0 12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  )
}