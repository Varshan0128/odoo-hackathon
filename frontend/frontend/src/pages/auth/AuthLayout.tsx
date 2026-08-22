import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] font-[var(--font-display)] text-base font-semibold text-white">
              D
            </div>
            <span className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              Dayflow
            </span>
          </div>
          {children}
        </div>
      </div>

      {/* Right: editorial brand panel */}
      <div className="relative hidden overflow-hidden bg-[var(--color-primary)] lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 38px, #fff 39px, transparent 40px)',
          }}
        />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/60">Odoo × NMIT Bangalore 2026</p>
        </div>
        <div className="relative max-w-md">
          <p className="font-[var(--font-display)] text-4xl font-medium leading-[1.15] text-white">
            Every workday, perfectly aligned.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Attendance, leave, and payroll — one calm, connected home for how your
            organization actually runs.
          </p>
        </div>
        <div className="relative flex items-center gap-6 text-sm text-white/50">
          <span>People first.</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>Performance next.</span>
        </div>
      </div>
    </div>
  )
}
