export type { Role, User } from './index'
export interface Session { userId: string; role: import('./index').Role; expiresAt?: string }
