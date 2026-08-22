import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'

export function Settings() {
  const { user } = useAuth()
  return (
    <>
      <PageHeader title="Settings" description="Account preferences." />
      <EmptyState
        title="Personal settings are unavailable"
        description={'You are signed in as ' + (user?.email || 'your account') + '. The current backend does not expose persistent personal-preference settings.'}
      />
    </>
  )
}

export default Settings
