import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Workspace configuration." />
      <EmptyState
        title="Workspace settings are unavailable"
        description="The current Dayflow backend does not expose persistent settings, department, or role-configuration APIs."
      />
    </>
  )
}

export default Settings
