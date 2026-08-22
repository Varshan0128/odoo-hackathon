import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

/**
 * NOTE: this enforces authorization only in the UI. A real backend
 * MUST re-check role permissions server-side for every request —
 * frontend role checks are a UX convenience, never the security
 * boundary. See PHASE "Security" of the build plan.
 */

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/signin" replace />
  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" replace />
  return <>{children}</>
}

export function RequireEmployee({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user?.role !== 'employee') return <Navigate to="/unauthorized" replace />
  return <>{children}</>
}

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
