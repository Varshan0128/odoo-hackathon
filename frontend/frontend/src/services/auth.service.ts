import type { User } from '@/types'
import { api, clearAuthToken, getAuthToken, setAuthToken } from './api'

interface AuthResponse {
  user: User
  token: string
  expiresAt: string
  notice?: string
}

export interface SignUpInput {
  name: string
  email: string
  password: string
  employeeId?: string
  department?: string
  position?: string
}

export const authService = {
  getToken: getAuthToken,
  clearToken: clearAuthToken,
  async signIn(email: string, password: string, persistent: boolean) {
    const response = await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthToken(response.token, persistent)
    return response
  },
  async signUp(input: SignUpInput) {
    const response = await api<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    setAuthToken(response.token, true)
    return response
  },
  async me() {
    const response = await api<{ user: User }>('/auth/me')
    return response.user
  },
  async logout() {
    if (getAuthToken()) await api<void>('/auth/logout', { method: 'POST' })
  },
}
