import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Check, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

const passwordRules = [
  { label: 'At least 8 characters', test: (password: string) => password.length >= 8 },
  { label: 'One uppercase letter', test: (password: string) => /[A-Z]/.test(password) },
  { label: 'One number', test: (password: string) => /[0-9]/.test(password) },
]

export function SignUp() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) {
      setError('Enter your name and work email.')
      return
    }
    if (!passwordRules.every((rule) => rule.test(password))) {
      setError('Your password does not meet the requirements.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('You must agree to continue.')
      return
    }
    setLoading(true)
    try {
      const notice = await signUp({
        name,
        email,
        password,
        employeeId: employeeId.trim() || undefined,
        department: department.trim() || undefined,
      })
      toast(notice || 'Account created successfully.')
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBF7F2] px-5 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-[#EAE3D9] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] font-semibold text-white">D</div>
          <span className="text-lg font-semibold text-[#221711]">Dayflow</span>
        </div>
        <h1 className="text-[26px] font-semibold text-[#221711]">Create your account</h1>
        <p className="mt-1.5 text-sm text-[#8A7F74]">
          The first account becomes the workspace administrator. Later registrations use employee access.
        </p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField icon={User} label="Full name" value={name} onChange={setName} placeholder="Your full name" />
            <TextField icon={Mail} label="Work email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password" />
            <TextField icon={Lock} label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField icon={User} label="Employee ID (optional)" value={employeeId} onChange={setEmployeeId} placeholder="DF-1007" />
            <TextField icon={Building2} label="Department (optional)" value={department} onChange={setDepartment} placeholder="Engineering" />
          </div>

          <div className="grid gap-1.5 text-xs text-[#8A7F74] sm:grid-cols-3">
            {passwordRules.map((rule) => {
              const passed = rule.test(password)
              return (
                <span key={rule.label} className={passed ? 'flex items-center gap-1 text-[#4A2F1F]' : 'flex items-center gap-1'}>
                  <Check className="size-3.5" /> {rule.label}
                </span>
              )
            })}
          </div>
          <label className="flex items-start gap-2 text-sm text-[#8A7F74]">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-4 w-4" />
            <span>I agree to use Dayflow responsibly for my organization.</span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#4A2F1F] to-[#2E1B10] py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'} {!loading && <ArrowRight className="size-4" />}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#8A7F74]">
          Already have an account? <Link to="/signin" className="font-medium text-[#B8763F] hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  )
}

function TextField({
  icon: Icon,
  label,
  value,
  onChange,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onChange: (value: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#221711]">{label}</span>
      <span className="flex items-center gap-2 rounded-lg border border-[#EAE3D9] bg-white px-3 py-2.5 focus-within:border-[#B8763F]">
        <Icon className="size-4 text-[#B5AA9C]" />
        <input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm outline-none" />
      </span>
    </label>
  )
}
