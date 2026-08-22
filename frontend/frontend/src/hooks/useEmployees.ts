import { useMemo } from 'react'
import { useData } from '@/lib/store'
export function useEmployees(query = '') { const { employees } = useData(); return useMemo(() => employees.filter((employee) => `${employee.name} ${employee.employeeId} ${employee.department}`.toLowerCase().includes(query.toLowerCase())), [employees, query]) }
