import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
export function EmployeeRoute({ children }: { children: ReactNode }) { const { user } = useAuth(); return user?.role === 'employee' ? <>{children}</> : <Navigate to="/dashboard" replace /> }
