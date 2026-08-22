const { evaluateSeverity } = require('./severity');

function rate(records, employeeIds, start, end) {
  const days = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6) days.push(cursor.toISOString().slice(0, 10));
  }
  if (!days.length || !employeeIds.length) return 0;
  const expected = days.length * employeeIds.length;
  const present = records.filter((item) => employeeIds.includes(item.userId) && days.includes(new Date(item.date).toISOString().slice(0, 10)) && ['present', 'late'].includes(item.status)).length;
  return (present / expected) * 100;
}

function detect(context) {
  const output = [];
  const threshold = context.config.attendanceChangeThreshold ?? 5;
  for (const group of [{ type: 'EMPLOYEE', items: context.employees }, ...context.departments]) {
    for (const item of group.items) {
      const ids = group.type === 'EMPLOYEE' ? [item.id] : group.items.map((employee) => employee.id);
      const current = rate(context.attendance, ids, context.dateRange.current.start, context.dateRange.current.end);
      const previous = rate(context.attendance, ids, context.dateRange.previous.start, context.dateRange.previous.end);
      const change = current - previous;
      if (Math.abs(change) < threshold) continue;
      const name = group.type === 'EMPLOYEE' ? item.profile?.fullName : item.name;
      output.push({ type: 'ATTENDANCE_ANOMALY', entityType: group.type, entityId: group.type === 'EMPLOYEE' ? item.id : item.name, employeeId: group.type === 'EMPLOYEE' ? item.employeeId : undefined, employeeName: group.type === 'EMPLOYEE' ? name : undefined, departmentName: group.type === 'DEPARTMENT' ? name : item.profile?.department, severity: evaluateSeverity('ATTENDANCE_ANOMALY', { change }), title: `${name} attendance anomaly`, summary: `Attendance changed ${change.toFixed(0)} percentage points between the comparison periods.`, evidence: { previousRate: Number(previous.toFixed(2)), currentRate: Number(current.toFixed(2)), change: Number(change.toFixed(2)) }, metrics: { previousRate: previous, currentRate: current, change }, recommendation: 'Review recent attendance patterns.', actionUrl: '/attendance' });
    }
  }
  return output;
}

module.exports = { detect, rate };
