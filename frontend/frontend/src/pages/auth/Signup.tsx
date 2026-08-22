import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, User, Mail, Lock, Eye, EyeOff, Check, Building2, PieChart, ShieldCheck, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'
import type { Role } from '@/types'

const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

export function SignUp() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [role, setRole] = useState<Role>('admin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const isHrAdmin = role === 'admin'

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Full name is required.'
    if (!email.trim()) next.email = 'Work email is required.'
    if (!PASSWORD_RULES.every((r) => r.test(password))) next.password = 'Password does not meet all requirements.'
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    if (isHrAdmin && !companyName.trim()) next.companyName = 'Company name is required.'
    if (!isHrAdmin && !employeeId.trim()) next.employeeId = 'Employee ID is required.'
    if (!agreed) next.agreed = 'You must agree to the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = signUp({ name, email, role, employeeId, companyName })
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
    <div className="flex min-h-screen bg-[#FBF7F2]">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] font-semibold text-white">D</div>
            <span className="text-lg font-semibold text-[#221711]">Dayflow</span>
          </div>

          <h1 className="text-[26px] font-semibold leading-tight text-[#221711]">Create your account</h1>
          <p className="mt-1.5 text-sm text-[#8A7F74]">Join Dayflow and streamline your HR operations.</p>

          {/* Role toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-[#EAE3D9] bg-white p-1">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                isHrAdmin ? 'bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] text-white' : 'text-[#8A7F74] hover:text-[#221711]'
              }`}
            >
              <Users className="h-4 w-4" />
              I'm an HR / Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                !isHrAdmin ? 'bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] text-white' : 'text-[#8A7F74] hover:text-[#221711]'
              }`}
            >
              <User className="h-4 w-4" />
              I'm an Employee
            </button>
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" error={errors.name}>
                <IconInput icon={User} placeholder="Enter your full name" value={name} onChange={setName} />
              </Field>
              <Field label="Work email" error={errors.email}>
                <IconInput icon={Mail} type="email" placeholder="name@company.com" value={email} onChange={setEmail} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" error={errors.password}>
                <IconInput
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={setPassword}
                  trailing={
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#B5AA9C] hover:text-[#8A7F74]">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </Field>
              <Field label="Confirm password" error={errors.confirmPassword}>
                <IconInput
                  icon={Lock}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  trailing={
                    <button type="button" onClick={() => setShowConfirm((s) => !s)} className="text-[#B5AA9C] hover:text-[#8A7F74]">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </Field>
            </div>

            <div>
              <p className="mb-2 text-xs text-[#8A7F74]">Password must contain:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(password)
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                      <Check className={`h-3.5 w-3.5 rounded-full ${passed ? 'text-[#B8763F]' : 'text-[#D8CFC2]'}`} />
                      <span className={passed ? 'text-[#221711]' : 'text-[#B5AA9C]'}>{rule.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {isHrAdmin ? (
              <Field label="Company name" error={errors.companyName}>
                <IconInput icon={Building2} placeholder="Enter your company name" value={companyName} onChange={setCompanyName} />
                <p className="mt-1.5 text-xs text-[#B5AA9C]">You can change this later from settings.</p>
              </Field>
            ) : (
              <Field label="Employee ID" error={errors.employeeId}>
                <IconInput icon={User} placeholder="DF-1007" value={employeeId} onChange={setEmployeeId} />
              </Field>
            )}

            <label className="flex items-start gap-2 text-sm text-[#8A7F74]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D8CFC2] text-[#4A2F1F] focus:ring-[#4A2F1F]"
              />
              <span>
                I agree to the{' '}
                <a href="/terms" className="font-medium text-[#B8763F] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="font-medium text-[#B8763F] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-600">{errors.agreed}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating account…' : 'Create account'}
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

          <p className="mt-6 text-center text-sm text-[#8A7F74]">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-[#B8763F] hover:underline">
              Sign in →
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
        <div className="my-6 h-0.5 w-14 bg-gradient-to-r from-[#D9A566] to-transparent" />
        <p className="max-w-sm text-[15px] leading-relaxed text-[#C9BEB2]">
          Dayflow brings attendance, leave, payroll, and people operations together in one calm, connected platform.
        </p>

        <div className="mt-10 space-y-6">
          <Feature icon={Users} title="People first" desc="Built for HR teams and employees to work better together." />
          <Feature icon={PieChart} title="All-in-one" desc="Attendance, leave, payroll, reports, and more in one place." />
          <Feature icon={ShieldCheck} title="Smart & simple" desc="Powerful features with an easy, distraction-free experience." />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-[15px] italic leading-relaxed text-[#EDE7DF]">
            “Dayflow has simplified the way we manage our people operations.”
          </p>
          <p className="mt-2 text-sm text-[#8A7F74]">— HR Manager, Growing Enterprise</p>
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
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E1F15]">
        <Icon className="h-5 w-5 text-[#D9A566]" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-[#8A7F74]">{desc}</p>
      </div>
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