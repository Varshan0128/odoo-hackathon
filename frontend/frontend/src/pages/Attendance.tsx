import { useAuth } from '@/lib/auth'
import { AdminAttendance } from './AdminAttendance'
import { MyAttendance } from './MyAttendance'

export function Attendance() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminAttendance /> : <MyAttendance />
}
