export function toIsoDate(value: Date | string = new Date()) { return new Date(value).toISOString().slice(0, 10) }
export function daysBetween(start: string, end: string) { return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1) }
export function formatDate(value: string) { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) }
