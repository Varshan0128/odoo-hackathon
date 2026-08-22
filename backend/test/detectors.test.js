const test = require('node:test');
const assert = require('node:assert/strict');
const { detect: attendance } = require('../services/exceptions/attendanceAnomaly');
const { detect: coverage } = require('../services/exceptions/leaveCoverageRisk');
const { detect: profile } = require('../services/exceptions/profileDataQuality');
const { detect: payroll } = require('../services/exceptions/payrollChange');

const date = (value) => new Date(`${value}T00:00:00Z`);
function context() { return { employees: [], attendance: [], leaves: [], payroll: [], departments: [], dateRange: { today: date('2026-08-21'), current: { start: date('2026-08-17'), end: date('2026-08-21') }, previous: { start: date('2026-08-10'), end: date('2026-08-14') } }, config: { attendanceChangeThreshold: 5, coverageThreshold: 70, payrollChangeThreshold: 10 } }; }

test('attendance anomaly detects 94 to 86 and ignores 94 to 91', () => {
  const employee = { id: '1', employeeId: 'E1', profile: { fullName: 'A', department: 'Eng' } }; const base = context(); base.dateRange = { today: date('2026-08-21'), previous: { start: date('2026-05-04'), end: date('2026-07-10') }, current: { start: date('2026-07-13'), end: date('2026-09-18') } }; const records = [];
  for (let cursor = new Date(base.dateRange.previous.start); cursor <= base.dateRange.previous.end; cursor.setUTCDate(cursor.getUTCDate() + 1)) if (![0, 6].includes(cursor.getUTCDay())) records.push({ userId: '1', date: new Date(cursor), status: records.length < 47 ? 'present' : 'absent' });
  const previousCount = records.length; for (let cursor = new Date(base.dateRange.current.start); cursor <= base.dateRange.current.end; cursor.setUTCDate(cursor.getUTCDate() + 1)) if (![0, 6].includes(cursor.getUTCDay())) records.push({ userId: '1', date: new Date(cursor), status: records.length - previousCount < 43 ? 'present' : 'absent' });
  const found = attendance({ ...base, employees: [employee], attendance: records, departments: [] }); assert.equal(found.length, 1); assert.equal(Math.round(found[0].evidence.change), -8);
  const stable = records.map((row) => ({ ...row, status: 'present' })); assert.equal(attendance({ ...base, employees: [employee], attendance: stable, departments: [] }).length, 0);
});
test('coverage detects 4 of 12 on leave but not 2', () => { const employees = Array.from({ length: 12 }, (_, i) => ({ id: String(i), profile: {} })); const leaves = [0, 1, 2, 3].map((i) => ({ userId: String(i), status: 'approved', startDate: date('2026-08-20'), endDate: date('2026-08-22') })); const found = coverage({ ...context(), departments: [{ name: 'Eng', items: employees }], leaves }); assert.equal(found.length, 1); assert.equal(found[0].evidence.availabilityPercentage, 66.67); });
test('profile quality reports missing email', () => { const found = profile({ ...context(), employees: [{ id: '1', employeeId: 'E1', email: '', profile: { fullName: 'A', phone: '1', address: 'x', department: 'E', designation: 'D' } }] }); assert.deepEqual(found[0].evidence.missingFields, ['work email']); });
test('payroll detector reports 50K to 59K', () => { const found = payroll({ ...context(), employees: [{ id: '1', employeeId: 'E1', profile: { fullName: 'A' } }], payroll: [[{ id: 'new', userId: '1', baseSalary: 59000 }, { id: 'old', userId: '1', baseSalary: 50000 }]] }); assert.equal(Math.round(found[0].evidence.changePercentage), 18); });
