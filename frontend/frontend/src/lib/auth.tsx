/**
 * DEMO AUTH CONTEXT
 * ------------------------------------------------------------------
 * There is no backend yet, so this is intentionally NOT secure auth.
 * It exists only so protected routes, role-based navigation, and the
 * signup/signin screens are wired up end-to-end for the demo.
 *
 * When the backend arrives:
 *  - signIn/signUp become real POST /auth/login and /auth/signup calls
 *  - the session token replaces the localStorage user object
 *  - route protection stays exactly the same shape (isAuthed, role)
 * ------------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Role, User } from '@/types'
import { useData } from '@/lib/store'

const SESSION_KEY = 'dayflow:session'

interface AuthContextValue {
  user: User | null
  isAuthed: boolean
  signIn: (email: string, _password: string) => { ok: boolean; error?: string }
  signUp: (input: { name: string; employeeId: string; email: string; role: Role; companyName?: string }) => { ok: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { employees, addEmployee } = useData()
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  const signIn: AuthContextValue['signIn'] = (email) => {
    const match = employees.find((e) => e.email.toLowerCase() === email.toLowerCase())
    if (!match) return { ok: false, error: 'No account found with that email. Check the address or sign up.' }
    setUser(match)
    return { ok: true }
  }

  const signUp: AuthContextValue['signUp'] = ({ name, employeeId, email, role, companyName }) => {
    if (employees.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    if (employees.some((e) => e.employeeId.toLowerCase() === employeeId.toLowerCase())) {
      return { ok: false, error: 'This Employee ID is already registered.' }
    }
    const palette = ['#43302A', '#3F6A93', '#3F7D58', '#B5772B', '#B23B3B', '#6F6459']
    const newUser: User = {
      id: `u${Date.now()}`,
      employeeId,
      name,
      email,
      role,
      department: companyName || 'Unassigned',
      position: role === 'admin' ? 'HR' : 'New Hire',
      avatarColor: palette[Math.floor(Math.random() * palette.length)],
    }
    addEmployee({
      ...newUser,
      status: 'Active',
      phone: '',
      address: '',
      joinDate: new Date().toISOString().slice(0, 10),
    })
    setUser(newUser)
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
