import type { InputHTMLAttributes } from 'react'
export function DatePicker(props: InputHTMLAttributes<HTMLInputElement>) { return <input type="date" {...props} className={`rounded border border-[var(--color-border)] bg-white px-3 py-2 text-sm ${props.className ?? ''}`} /> }
