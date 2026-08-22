import { Link } from 'react-router-dom'

export function VerifyEmail() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)] p-6">
      <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-semibold">Email verification is not configured</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          This Dayflow backend does not send verification emails. Your account can be used immediately after registration.
        </p>
        <Link className="mt-5 inline-block font-medium text-[var(--color-primary)] underline" to="/signin">Back to sign in</Link>
      </div>
    </main>
  )
}
