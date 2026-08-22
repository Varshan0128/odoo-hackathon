const { SEVERITIES } = require('./constants');

function evaluateSeverity(type, metrics = {}, config = {}) {
  if (type === 'PAYROLL_CHANGE') return SEVERITIES.URGENT;
  if (type === 'LEAVE_VALIDATION') return SEVERITIES.URGENT;
  if (type === 'LEAVE_COVERAGE_RISK' && metrics.availabilityPercentage < (config.criticalCoverageThreshold ?? 50)) return SEVERITIES.URGENT;
  if (type === 'ATTENDANCE_ANOMALY' || type === 'LEAVE_COVERAGE_RISK') return SEVERITIES.ATTENTION;
  return SEVERITIES.WATCH;
}

module.exports = { evaluateSeverity };
