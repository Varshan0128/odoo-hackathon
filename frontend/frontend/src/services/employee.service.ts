import type { Employee } from '@/types'
export const employeeService = { async list() { return [] as Employee[] }, async get(_id: string) { return null as Employee | null } }
