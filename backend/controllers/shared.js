const { Prisma } = require('@prisma/client');

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function toDecimal(value) {
  if (value instanceof Prisma.Decimal) {
    return value;
  }

  return new Prisma.Decimal(value ?? 0);
}

function serialize(value) {
  if (value instanceof Prisma.Decimal) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (value && typeof value === 'object') {
    const output = {};

    for (const [key, nested] of Object.entries(value)) {
      output[key] = serialize(nested);
    }

    return output;
  }

  return value;
}

function normalizeDateOnly(dateInput) {
  const date = new Date(dateInput);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function daysInclusive(startDate, endDate) {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);
  const diff = Math.floor((end - start) / (24 * 60 * 60 * 1000));
  return diff + 1;
}

function createNetPay(baseSalary, allowances, deductions) {
  return toDecimal(baseSalary).plus(toDecimal(allowances)).minus(toDecimal(deductions));
}

function avatarColor(name = '') {
  const colors = ['#D8B08C', '#9FB5A3', '#B4A7C8', '#D7A6A0', '#A6B8C8', '#C5B78D'];
  const value = Array.from(name).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return colors[value % colors.length];
}

function toFrontendUser(user) {
  const profile = user.profile || {};
  return {
    id: user.id,
    employeeId: user.employeeId,
    name: profile.fullName || user.email,
    email: user.email,
    role: user.role === 'hr' ? 'admin' : 'employee',
    department: profile.department || '',
    position: profile.designation || '',
    avatarColor: avatarColor(profile.fullName || user.email),
    status: user.status === 'active' ? 'Active' : 'Inactive',
    phone: profile.phone || '',
    address: profile.address || '',
    joinDate: profile.dateOfJoining ? new Date(profile.dateOfJoining).toISOString() : '',
  };
}

function toFrontendAttendance(record) {
  const date = new Date(record.date);
  const duration = record.checkInTime && record.checkOutTime
    ? Math.max(0, (new Date(record.checkOutTime) - new Date(record.checkInTime)) / 3600000)
    : null;
  const employee = record.user ? toFrontendUser(record.user) : null;
  return {
    id: record.id,
    employeeId: employee?.employeeId || record.userId,
    date: date.toISOString().slice(0, 10),
    status: record.status,
    checkIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : undefined,
    checkOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : undefined,
    workingDuration: duration === null ? undefined : `${Math.floor(duration)}h ${Math.round((duration % 1) * 60)}m`,
    user: employee,
  };
}

function toFrontendLeave(request) {
  const employee = request.user ? toFrontendUser(request.user) : null;
  const status = String(request.status).toLowerCase();
  return {
    id: request.id,
    employeeId: employee?.employeeId || request.userId,
    employeeName: employee?.name || '',
    department: employee?.department || '',
    type: request.leaveType?.name || '',
    startDate: new Date(request.startDate).toISOString().slice(0, 10),
    endDate: new Date(request.endDate).toISOString().slice(0, 10),
    days: Number(request.days),
    remarks: request.remarks || undefined,
    status: status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending',
    comment: request.decisionComment || undefined,
    appliedOn: new Date(request.createdAt).toISOString(),
  };
}

function toFrontendPayroll(payroll) {
  const employee = payroll.user ? toFrontendUser(payroll.user) : null;
  return {
    id: payroll.id,
    employeeId: employee?.employeeId || payroll.userId,
    basic: Number(payroll.baseSalary),
    hra: 0,
    allowances: Number(payroll.allowances),
    deductions: Number(payroll.deductions),
    netSalary: Number(payroll.netPay),
    lastRevised: new Date(payroll.updatedAt).toISOString(),
    year: payroll.year,
    month: payroll.month,
    status: payroll.status,
    slipNumber: payroll.salarySlip?.slipNumber || null,
  };
}

module.exports = {
  asyncHandler,
  serialize,
  normalizeDateOnly,
  daysInclusive,
  createNetPay,
  toDecimal,
  toFrontendUser,
  toFrontendAttendance,
  toFrontendLeave,
  toFrontendPayroll,
};
