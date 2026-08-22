const { evaluateSeverity } = require('./severity');

function detect(context) {
  const threshold = context.config.coverageThreshold ?? 70;
  return context.departments.flatMap((department) => {
    const ids = new Set(department.items.map((item) => item.id));
    const activeLeaves = context.leaves.filter((leave) => ids.has(leave.userId) && ['approved', 'pending'].includes(leave.status) && new Date(leave.startDate) <= context.dateRange.today && new Date(leave.endDate) >= context.dateRange.today);
    const available = department.items.length - new Set(activeLeaves.map((leave) => leave.userId)).size;
    const availabilityPercentage = department.items.length ? (available / department.items.length) * 100 : 100;
    if (availabilityPercentage >= threshold) return [];
    return [{ type: 'LEAVE_COVERAGE_RISK', entityType: 'DEPARTMENT', entityId: department.name, departmentName: department.name, severity: evaluateSeverity('LEAVE_COVERAGE_RISK', { availabilityPercentage }, context.config), title: `${department.name} leave coverage risk`, summary: `${department.name} has ${activeLeaves.length} employee(s) on leave.`, evidence: { teamSize: department.items.length, employeesCurrentlyOnLeave: new Set(activeLeaves.map((leave) => leave.userId)).size, availableEmployees: available, availabilityPercentage: Number(availabilityPercentage.toFixed(2)) }, metrics: { availabilityPercentage }, recommendation: 'Review team coverage before approving additional leave.', actionUrl: '/leave' }];
  });
}

module.exports = { detect };
