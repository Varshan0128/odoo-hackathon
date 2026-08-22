import type { Role } from '@/types'
export const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' } as const satisfies Record<string, Role>
export const ROLE_LABELS: Record<Role, string> = { admin: 'HR Administrator', employee: 'Employee' }
