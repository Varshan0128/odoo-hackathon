const { evaluateSeverity } = require('./severity');

function detect(context) {
  const threshold = context.config.payrollChangeThreshold ?? 10;
  return context.payroll.flatMap((rows) => {
    if (rows.length < 2) return [];
    const current = Number(rows[0].baseSalary);
    const previous = Number(rows[1].baseSalary);
    if (!previous) return [];
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < threshold) return [];
    const employee = context.employees.find((item) => item.id === rows[0].userId);
    return [{ type: 'PAYROLL_CHANGE', entityType: 'PAYROLL', entityId: rows[0].id, employeeId: employee?.employeeId, employeeName: employee?.profile?.fullName, departmentName: employee?.profile?.department, severity: evaluateSeverity('PAYROLL_CHANGE'), title: `${employee?.profile?.fullName || 'Employee'} payroll changed`, summary: `Payroll changed ${change.toFixed(1)}% between the latest records.`, evidence: { previousAmount: previous, currentAmount: current, changePercentage: Number(change.toFixed(2)) }, metrics: { changePercentage: change }, recommendation: 'Review the payroll records and supporting approvals.', actionUrl: '/payroll' }];
  });
}

module.exports = { detect };
