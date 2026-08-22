const { evaluateSeverity } = require('./severity');

function detect(context) {
  return context.employees.flatMap((employee) => {
    const profile = employee.profile || {};
    const missing = [];
    if (!employee.email) missing.push('work email');
    if (!profile.phone) missing.push('phone');
    if (!profile.address) missing.push('address');
    if (!profile.department) missing.push('department');
    if (!profile.designation) missing.push('job title');
    if (!missing.length) return [];
    return [{ type: 'PROFILE_DATA_QUALITY', entityType: 'PROFILE', entityId: employee.id, employeeId: employee.employeeId, employeeName: profile.fullName || employee.email, departmentName: profile.department, severity: evaluateSeverity('PROFILE_DATA_QUALITY'), title: `${profile.fullName || employee.email} profile needs attention`, summary: `Profile data is missing: ${missing.join(', ')}.`, evidence: { missingFields: missing }, metrics: { missingFieldCount: missing.length }, recommendation: 'Review and complete the supported employee profile fields.', actionUrl: `/employees/${employee.employeeId}` }];
  });
}

module.exports = { detect };
