import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { Table, Td, Th, Thead, Tr } from '@/components/ui/Table'
import { useData } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { SalaryStructure } from '@/types'

type FormState = {
  employeeId: string
  basic: string
  hra: string
  allowances: string
  deductions: string
  lastRevised: string
}

const blankForm: FormState = {
  employeeId: '',
  basic: '',
  hra: '',
  allowances: '',
  deductions: '',
  lastRevised: new Date().toISOString().slice(0, 10),
}

export function Payroll() {
  const { employees, salaries, updateSalary, loading, error } = useData()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(blankForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const openNew = () => {
    setForm({ ...blankForm, employeeId: employees[0]?.employeeId ?? '' })
    setFormError('')
    setOpen(true)
  }
  const openEdit = (salary: SalaryStructure) => {
    setForm({
      employeeId: salary.employeeId,
      basic: String(salary.basic),
      hra: String(salary.hra),
      allowances: String(salary.allowances),
      deductions: String(salary.deductions),
      lastRevised: salary.lastRevised,
    })
    setFormError('')
    setOpen(true)
  }
  const save = async () => {
    const parsed = {
      basic: Number(form.basic),
      hra: Number(form.hra),
      allowances: Number(form.allowances),
      deductions: Number(form.deductions),
    }
    if (!form.employeeId || !form.lastRevised || Object.values(parsed).some((value) => !Number.isFinite(value) || value < 0)) {
      setFormError('Choose an employee, a payroll date, and non-negative salary amounts.')
      return
    }
    setSaving(true)
    try {
      await updateSalary(form.employeeId, { ...parsed, lastRevised: form.lastRevised })
      toast('Payroll record saved.')
      setOpen(false)
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Unable to save payroll.')
    } finally {
      setSaving(false)
    }
  }

  const employeeName = (employeeId: string) => employees.find((employee) => employee.employeeId === employeeId)?.name || employeeId

  return (
    <div>
      <PageHeader title="Payroll" description="Review and maintain persisted salary structures." action={<Button size="sm" onClick={openNew}><Plus className="size-4" /> Set payroll</Button>} />
      <Card>
        <CardContent className="pt-5">
          {loading ? <SkeletonTable rows={6} /> : error ? (
            <EmptyState title="Unable to load payroll" description={error} />
          ) : salaries.length === 0 ? (
            <EmptyState title="No payroll records" description="Set up a salary structure to create the first persistent payroll record." action={<Button size="sm" onClick={openNew}>Set payroll</Button>} />
          ) : (
            <Table>
              <Thead><tr><Th>Employee</Th><Th>Basic</Th><Th>Allowances</Th><Th>Deductions</Th><Th>Net salary</Th><Th>Revised</Th><Th></Th></tr></Thead>
              <tbody>
                {salaries.map((salary) => (
                  <Tr key={salary.employeeId}>
                    <Td><p className="font-medium text-[var(--color-ink)]">{employeeName(salary.employeeId)}</p><p className="text-xs text-[var(--color-ink-muted)]">{salary.employeeId}</p></Td>
                    <Td>{formatCurrency(salary.basic)}</Td>
                    <Td>{formatCurrency(salary.hra + salary.allowances)}</Td>
                    <Td>{formatCurrency(salary.deductions)}</Td>
                    <Td className="font-medium">{formatCurrency(salary.netSalary)}</Td>
                    <Td>{formatDate(salary.lastRevised)}</Td>
                    <Td><Button variant="ghost" size="sm" onClick={() => openEdit(salary)}><Pencil className="size-3.5" /> Edit</Button></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Set payroll"
        description="Changes are saved to the backend and become visible to the employee."
        footer={<><Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button><Button onClick={() => { void save() }} loading={saving}>Save payroll</Button></>}
      >
        <div className="space-y-3">
          <Select label="Employee" value={form.employeeId} onChange={(event) => setForm({ ...form, employeeId: event.target.value })}>
            {employees.filter((employee) => employee.status !== 'Inactive').map((employee) => <option key={employee.id} value={employee.employeeId}>{employee.name} · {employee.employeeId}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Basic" type="number" min="0" value={form.basic} onChange={(event) => setForm({ ...form, basic: event.target.value })} />
            <Input label="HRA" type="number" min="0" value={form.hra} onChange={(event) => setForm({ ...form, hra: event.target.value })} />
            <Input label="Allowances" type="number" min="0" value={form.allowances} onChange={(event) => setForm({ ...form, allowances: event.target.value })} />
            <Input label="Deductions" type="number" min="0" value={form.deductions} onChange={(event) => setForm({ ...form, deductions: event.target.value })} />
          </div>
          <Input label="Effective date" type="date" value={form.lastRevised} onChange={(event) => setForm({ ...form, lastRevised: event.target.value })} />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
        </div>
      </Modal>
    </div>
  )
}

export default Payroll
