const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/[/]$/, '')
const TOKEN_KEY = 'dayflow:token'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string, persistent = true) {
  const target = persistent ? localStorage : sessionStorage
  const other = persistent ? sessionStorage : localStorage
  other.removeItem(TOKEN_KEY)
  target.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const token = getAuthToken()
  if (token) headers.set('Authorization', 'Bearer ' + token)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(API_URL + path, { ...options, headers })
  } catch {
    throw new ApiError(0, 'Unable to reach Dayflow. Check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') ?? ''
  const payload: unknown = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : response.status === 403
            ? 'You do not have permission to perform this action.'
            : 'The request could not be completed. Please try again.'
    if (response.status === 401) window.dispatchEvent(new Event('dayflow:unauthorized'))
    throw new ApiError(response.status, message)
  }

  return payload as T
}
