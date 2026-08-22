import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, PieChart, ShieldCheck, Users } from 'lucide-react'
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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password, remember)
      toast('Signed in successfully.')
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FBF7F2]">
      <main className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] font-semibold text-white">D</div>
            <span className="text-lg font-semibold text-[#221711]">Dayflow</span>
          </div>
          <h1 className="text-[26px] font-semibold leading-tight text-[#221711]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#8A7F74]">Sign in to your Dayflow workspace.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <Field label="Work email">
              <IconInput icon={Mail} type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={setEmail} />
            </Field>
            <Field label="Password" error={error}>
              <IconInput
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                trailing={
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-[#B5AA9C] hover:text-[#8A7F74]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#221711]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-[#D8CFC2] text-[#4A2F1F] focus:ring-[#4A2F1F]"
              />
              Keep me signed in on this device
            </label>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A7F74]">
            New to Dayflow? <Link to="/signup" className="font-medium text-[#B8763F] hover:underline">Create an account</Link>
          </p>
        </div>
      </main>

      <aside className="relative hidden overflow-hidden bg-[#1E140D] px-14 py-14 lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
        <span className="text-xs font-medium tracking-wide text-[#D9A566]">ODOO × NMIT BANGALORE 2026</span>
        <h2 className="mt-4 max-w-md text-[38px] font-semibold leading-[1.15] text-white">
          Every workday, <span className="text-[#D9A566]">perfectly aligned.</span>
        </h2>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#C9BEB2]">
          Attendance, leave, payroll, and people operations connected to one persistent source of truth.
        </p>
        <div className="mt-12 grid grid-cols-3 gap-6">
          <Feature icon={Users} title="People first" desc="Built for HR teams and employees." />
          <Feature icon={PieChart} title="All-in-one" desc="Connected operational workflows." />
          <Feature icon={ShieldCheck} title="Secure" desc="Session and role-aware access." />
        </div>
      </aside>
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
  onChange: (value: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#EAE3D9] bg-white px-3 py-2.5 focus-within:border-[#B8763F]">
      <Icon className="h-4 w-4 shrink-0 text-[#B5AA9C]" />
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-[#221711] placeholder:text-[#B5AA9C] focus:outline-none"
      />
      {trailing}
    </div>
  )
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E1F15]"><Icon className="h-5 w-5 text-[#D9A566]" /></div>
      <p className="mt-3 text-[15px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#8A7F74]">{desc}</p>
    </div>
  )
}
