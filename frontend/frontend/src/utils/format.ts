export function formatCurrency(value: number) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value) }
export function formatNumber(value: number) { return new Intl.NumberFormat('en-IN').format(value) }
export function titleCase(value: string) { return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) }
