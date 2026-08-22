import type { ReactNode } from 'react'
export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) { return <div className="rounded-lg border border-[var(--color-border)] bg-white p-4"><div className="flex justify-between text-sm text-[var(--color-ink-muted)]">{label}{icon}</div><p className="mt-2 text-2xl font-semibold">{value}</p></div> }
