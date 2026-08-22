import { useAuth } from '@/lib/auth'
import { AdminDashboard } from './AdminDashboard'
import { EmployeeDashboard } from './EmployeeDashboard'

export function Dashboard() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />
}
