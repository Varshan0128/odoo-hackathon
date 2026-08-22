import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { authService, type SignUpInput } from '@/services/auth.service'

interface AuthContextValue {
  user: User | null
  isAuthed: boolean
  isRestoring: boolean
  signIn: (email: string, password: string, persistent: boolean) => Promise<void>
  signUp: (input: SignUpInput) => Promise<string | undefined>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isRestoring, setIsRestoring] = useState(true)

  const clearSession = useCallback(() => {
    authService.clearToken()
    setUser(null)
  }, [])

  useEffect(() => {
    let active = true
    const restore = async () => {
      if (!authService.getToken()) {
        if (active) setIsRestoring(false)
        return
      }
      try {
        const sessionUser = await authService.me()
        if (active) setUser(sessionUser)
      } catch {
        authService.clearToken()
      } finally {
        if (active) setIsRestoring(false)
      }
    }
    void restore()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession()
      setIsRestoring(false)
    }
    window.addEventListener('dayflow:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('dayflow:unauthorized', handleUnauthorized)
  }, [clearSession])

  const signIn = useCallback(async (email: string, password: string, persistent: boolean) => {
    const session = await authService.signIn(email, password, persistent)
    setUser(session.user)
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const session = await authService.signUp(input)
    setUser(session.user)
    return session.notice
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Clearing local credentials is still required when a logout request cannot complete.
    } finally {
      clearSession()
    }
  }, [clearSession])

  return (
    <AuthContext.Provider value={{ user, isAuthed: Boolean(user), isRestoring, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
