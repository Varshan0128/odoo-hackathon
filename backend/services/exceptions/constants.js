const EXCEPTION_TYPES = Object.freeze({
  ATTENDANCE_ANOMALY: 'ATTENDANCE_ANOMALY',
  LEAVE_COVERAGE_RISK: 'LEAVE_COVERAGE_RISK',
  LEAVE_VALIDATION: 'LEAVE_VALIDATION',
  PROFILE_DATA_QUALITY: 'PROFILE_DATA_QUALITY',
  PAYROLL_CHANGE: 'PAYROLL_CHANGE',
});

const SEVERITIES = Object.freeze({ URGENT: 'URGENT', ATTENTION: 'ATTENTION', WATCH: 'WATCH' });
const STATUSES = Object.freeze({ OPEN: 'OPEN', REVIEWED: 'REVIEWED', RESOLVED: 'RESOLVED', DISMISSED: 'DISMISSED' });

const severityToDb = { URGENT: 'critical', ATTENTION: 'high', WATCH: 'low' };
const statusToDb = { OPEN: 'open', REVIEWED: 'investigating', RESOLVED: 'resolved', DISMISSED: 'ignored' };
const dbToSeverity = Object.fromEntries(Object.entries(severityToDb).map(([key, value]) => [value, key]));
const dbToStatus = Object.fromEntries(Object.entries(statusToDb).map(([key, value]) => [value, key]));

module.exports = { EXCEPTION_TYPES, SEVERITIES, STATUSES, severityToDb, statusToDb, dbToSeverity, dbToStatus };
