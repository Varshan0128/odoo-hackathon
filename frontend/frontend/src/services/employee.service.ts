import type { Employee, EmployeeStatus, Role } from '@/types'
import { api } from './api'

export interface EmployeeFilters {
  search?: string
  department?: string
  role?: Role | 'All'
  status?: EmployeeStatus | 'All'
}

export interface CreateEmployeeInput {
  name: string
  email: string
  password: string
  employeeId?: string
  department: string
  position: string
  phone?: string
  address?: string
  joinDate?: string
  role?: Role
  status?: EmployeeStatus
}

function queryString(filters: EmployeeFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const value = params.toString()
  return value ? '?' + value : ''
}

export const employeeService = {
  async list(filters: EmployeeFilters = {}) {
    const response = await api<{ data: Employee[] }>('/employees' + queryString(filters))
    return response.data
  },
  async get(employeeId: string) {
    const response = await api<{ data: Employee }>('/employees/' + encodeURIComponent(employeeId))
    return response.data
  },
  async create(input: CreateEmployeeInput) {
    const response = await api<{ data: Employee }>('/employees', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return response.data
  },
  async update(employeeId: string, patch: Partial<Employee>) {
    const response = await api<{ data: Employee }>('/employees/' + encodeURIComponent(employeeId), {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    return response.data
  },
}
