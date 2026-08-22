import { useData } from '@/lib/store'
export function useLeave(employeeId?: string) { const data = useData(); return { ...data, requests: employeeId ? data.leaveRequests.filter((request) => request.employeeId === employeeId) : data.leaveRequests } }
