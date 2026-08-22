const provider = require('./aiProvider');
const { buildPrompt } = require('./promptBuilder');

function fallback(exception) {
  const evidence = exception.evidence || {};
  if (exception.type === 'ATTENDANCE_ANOMALY') return `${exception.departmentName || exception.employeeName || 'Attendance'} changed from ${evidence.previousRate}% to ${evidence.currentRate}%, a ${Math.abs(evidence.change)} percentage-point change. Review recent attendance patterns.`;
  if (exception.type === 'LEAVE_COVERAGE_RISK') return `${exception.departmentName} has ${evidence.availableEmployees} of ${evidence.teamSize} employees available (${evidence.availabilityPercentage}%). Review team coverage before approving additional leave.`;
  if (exception.type === 'PROFILE_DATA_QUALITY') return `${exception.employeeName}'s profile is missing ${evidence.missingFields.join(', ')}. Review the supported profile fields.`;
  if (exception.type === 'PAYROLL_CHANGE') return `Payroll changed from ${evidence.previousAmount} to ${evidence.currentAmount}, a ${evidence.changePercentage}% change. Review the records and supporting approvals.`;
  return exception.summary || 'Review the supplied HR evidence.';
}

async function generateExplanation(exception) {
  try { return (await provider.generateText(buildPrompt(exception))).trim() || fallback(exception); } catch { return fallback(exception); }
}

module.exports = { generateExplanation, fallback };
