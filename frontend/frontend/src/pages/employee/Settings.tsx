import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/lib/auth'
export function Settings() { const { user } = useAuth(); return <><PageHeader title="Settings" description="Manage your personal Dayflow preferences." /><div className="rounded-lg border border-[var(--color-border)] bg-white p-5 text-sm text-slate-500">Signed in as {user?.email}. Personal preferences are managed here.</div></> }
export default Settings
