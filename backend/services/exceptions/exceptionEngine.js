const prisma = require('../../config/prisma');
const registry = require('./exceptionRegistry');
const { generateExplanation } = require('../ai/aiExplanationService');
const { severityToDb, statusToDb, dbToSeverity, dbToStatus } = require('./constants');

function periodBounds(now = new Date()) {
  const day = (now.getUTCDay() + 6) % 7;
  const currentEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const currentStart = new Date(currentEnd); currentStart.setUTCDate(currentStart.getUTCDate() - day);
  const previousEnd = new Date(currentStart); previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd); previousStart.setUTCDate(previousStart.getUTCDate() - 6);
  return { today: currentEnd, current: { start: currentStart, end: currentEnd }, previous: { start: previousStart, end: previousEnd } };
}

async function aggregate() {
  const [employees, attendance, leaves, payroll] = await Promise.all([
    prisma.user.findMany({ where: { role: 'employee', status: 'active' }, include: { profile: true } }),
    prisma.attendanceRecord.findMany({ where: { date: { gte: new Date(Date.now() - 21 * 86400000) } }, select: { userId: true, date: true, status: true } }),
    prisma.leaveRequest.findMany({ where: { status: { in: ['approved', 'pending'] } }, select: { id: true, userId: true, startDate: true, endDate: true, status: true } }),
    prisma.payroll.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, userId: true, baseSalary: true, createdAt: true } }),
  ]);
  const byDepartment = new Map();
  for (const employee of employees) { const name = employee.profile?.department || 'Unassigned'; if (!byDepartment.has(name)) byDepartment.set(name, []); byDepartment.get(name).push(employee); }
  return { employees, attendance, leaves, payroll: [...new Map(payroll.map((row) => [row.userId, [...(new Map()).get(row.userId) || [], row]])).values()], departments: [...byDepartment].map(([name, items]) => ({ name, items })), dateRange: periodBounds(), config: { attendanceChangeThreshold: Number(process.env.EXCEPTION_ATTENDANCE_THRESHOLD || 5), coverageThreshold: Number(process.env.EXCEPTION_COVERAGE_THRESHOLD || 70), criticalCoverageThreshold: Number(process.env.EXCEPTION_CRITICAL_COVERAGE_THRESHOLD || 50), payrollChangeThreshold: Number(process.env.EXCEPTION_PAYROLL_THRESHOLD || 10) } };
}

function publicException(exception, record) {
  return { id: record?.id || exception.id, type: exception.type, severity: exception.severity, status: record ? (dbToStatus[record.status] || 'OPEN') : 'OPEN', title: exception.title, summary: exception.summary, entityType: exception.entityType, entityId: exception.entityId, employeeId: exception.employeeId, employeeName: exception.employeeName, departmentName: exception.departmentName, detectedAt: record?.createdAt || new Date(), evidence: exception.evidence, metrics: exception.metrics, recommendation: exception.recommendation, aiExplanation: exception.aiExplanation, actionUrl: exception.actionUrl, metadata: { source: 'dayflow-data-source', detector: exception.type } };
}

async function evaluate({ persist = true } = {}) {
  const context = await aggregate();
  const detected = Object.values(registry).flatMap((detector) => detector.detect(context));
  const explained = await Promise.all(detected.map(async (exception) => ({ ...exception, aiExplanation: await generateExplanation(exception) })));
  if (!persist) return explained.map((item) => publicException(item));
  const output = [];
  for (const exception of explained) {
    const existing = await prisma.aiException.findFirst({ where: { category: exception.type, userId: exception.employeeId ? context.employees.find((item) => item.employeeId === exception.employeeId)?.id : null, status: { in: ['open', 'investigating'] } }, orderBy: { createdAt: 'desc' } });
    const data = { userId: exception.employeeId ? context.employees.find((item) => item.employeeId === exception.employeeId)?.id : null, severity: severityToDb[exception.severity], category: exception.type, title: exception.title, description: exception.aiExplanation, evidence: exception.evidence, deterministicFacts: exception.metrics };
    const record = existing ? await prisma.aiException.update({ where: { id: existing.id }, data }) : await prisma.aiException.create({ data });
    output.push(publicException(exception, record));
  }
  return output;
}

function serializeException(record) { return { id: record.id, type: record.category, severity: dbToSeverity[record.severity] || 'WATCH', status: dbToStatus[record.status] || 'OPEN', title: record.title, summary: record.description, employeeId: record.user?.employeeId, employeeName: record.user?.profile?.fullName, departmentName: record.user?.profile?.department, detectedAt: record.createdAt, evidence: record.evidence, metrics: record.deterministicFacts, aiExplanation: record.description, recommendation: 'Review the evidence before deciding.', metadata: { persisted: true } }; }

module.exports = { aggregate, evaluate, serializeException };
