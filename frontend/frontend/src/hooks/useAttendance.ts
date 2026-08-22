import { useData } from '@/lib/store'
export function useAttendance(employeeId?: string) { const data = useData(); return { ...data, records: employeeId ? data.attendance.filter((record) => record.employeeId === employeeId) : data.attendance } }
