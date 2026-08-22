import type { SalaryStructure } from '@/types'
import { api } from './api'

export interface PayrollInput {
  basic: number
  hra: number
  allowances: number
  deductions: number
  lastRevised: string
}

export const payrollService = {
  async list(employeeId?: string) {
    const suffix = employeeId ? '?employeeId=' + encodeURIComponent(employeeId) : ''
    const response = await api<{ data: SalaryStructure[] }>('/payroll' + suffix)
    return response.data
  },
  async save(employeeId: string, input: PayrollInput) {
    const response = await api<{ data: SalaryStructure }>('/payroll/' + encodeURIComponent(employeeId), {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return response.data
  },
}
