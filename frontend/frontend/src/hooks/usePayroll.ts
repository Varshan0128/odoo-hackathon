import { useData } from '@/lib/store'
export function usePayroll(employeeId?: string) { const data = useData(); return { ...data, records: employeeId ? data.salaries.filter((salary) => salary.employeeId === employeeId) : data.salaries } }
