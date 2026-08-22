import type { Role } from '@/types'
export const can = (role: Role | undefined, permission: string) => role === 'admin' || permission.startsWith('self:')
