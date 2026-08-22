const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { asyncHandler, toFrontendUser } = require('./shared');

const employeeInclude = { profile: true };
const toEmployee = toFrontendUser;
const userWhere = (id) => ({ OR: [{ id }, { employeeId: id }] });

const listEmployees = asyncHandler(async (req, res) => {
  const { search, department, role, status } = req.query;
  const where = {
    ...(search ? { OR: [
      { employeeId: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { fullName: { contains: search, mode: 'insensitive' } } },
      { profile: { department: { contains: search, mode: 'insensitive' } } },
    ] } : {}),
    ...(department && department !== 'All' ? { profile: { department } } : {}),
    ...(role && role !== 'All' ? { role: role === 'admin' ? 'hr' : role } : {}),
    ...(status && status !== 'All' ? { status: status === 'Active' ? 'active' : 'inactive' } : {}),
  };
  const users = await prisma.user.findMany({ where, include: employeeInclude, orderBy: { employeeId: 'asc' } });
  const data = users.map(toEmployee);
  return res.json({ data, employees: data });
});

const getEmployee = asyncHandler(async (req, res) => {
  const requestedId = req.params.id;
  if (req.user.role !== 'hr' && requestedId !== req.user.userId) {
    const current = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!current || current.employeeId !== requestedId) return res.status(403).json({ message: 'Forbidden' });
  }
  const user = await prisma.user.findFirst({ where: userWhere(requestedId), include: employeeInclude });
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  const data = toEmployee(user);
  return res.json({ data, employee: data });
});

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, department, position, phone, address, joinDate, role } = req.body;
  if (!name || !email || !password || !department || !position) return res.status(400).json({ message: 'Name, email, password, department, and position are required' });
  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.user.findFirst({ where: { OR: [{ email: normalizedEmail }, ...(employeeId ? [{ employeeId }] : [])] } });
  if (existing) return res.status(409).json({ message: 'Email or employee ID already exists' });
  const user = await prisma.user.create({
    data: {
      employeeId: employeeId || `EMP-${Date.now()}`,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      role: role === 'admin' ? 'hr' : 'employee',
      profile: { create: { fullName: name, department, designation: position, phone: phone || null, address: address || null, dateOfJoining: joinDate ? new Date(joinDate) : null } },
    },
    include: employeeInclude,
  });
  const data = toEmployee(user);
  return res.status(201).json({ data, employee: data });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({ where: userWhere(req.params.id), include: employeeInclude });
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  if (req.user.role !== 'hr' && user.id !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
  const { name, email, phone, address, department, position, status, joinDate } = req.body;
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(email !== undefined ? { email: email.toLowerCase() } : {}),
      ...(status !== undefined ? { status: status === 'Active' ? 'active' : 'inactive' } : {}),
      profile: { update: { data: {
        ...(name !== undefined ? { fullName: name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(department !== undefined ? { department } : {}),
        ...(position !== undefined ? { designation: position } : {}),
        ...(joinDate !== undefined ? { dateOfJoining: joinDate ? new Date(joinDate) : null } : {}),
      } } },
    },
    include: employeeInclude,
  });
  const data = toEmployee(updated);
  return res.json({ data, employee: data });
});

const listDepartments = asyncHandler(async (req, res) => {
  const departments = await prisma.employeeProfile.findMany({ where: { department: { not: null } }, distinct: ['department'], select: { department: true }, orderBy: { department: 'asc' } });
  const data = departments.map((item) => item.department).filter(Boolean);
  return res.json({ data, departments: data });
});

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, listDepartments };
