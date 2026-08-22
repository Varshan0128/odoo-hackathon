export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const required = (value: string) => value.trim().length > 0
export const minLength = (value: string, length: number) => value.length >= length
