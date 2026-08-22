import { Link } from 'react-router-dom'
export function NotFound() { return <main className="mx-auto max-w-lg p-10 text-center"><h1 className="text-3xl font-semibold">Page not found</h1><p className="mt-2 text-slate-500">The page you requested does not exist.</p><Link className="mt-5 inline-block underline" to="/dashboard">Return to dashboard</Link></main> }
