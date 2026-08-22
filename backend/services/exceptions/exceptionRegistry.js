const attendanceAnomaly = require('./attendanceAnomaly');
const leaveCoverageRisk = require('./leaveCoverageRisk');
const profileDataQuality = require('./profileDataQuality');
const payrollChange = require('./payrollChange');

module.exports = Object.freeze({ ATTENDANCE_ANOMALY: attendanceAnomaly, LEAVE_COVERAGE_RISK: leaveCoverageRisk, PROFILE_DATA_QUALITY: profileDataQuality, PAYROLL_CHANGE: payrollChange });
