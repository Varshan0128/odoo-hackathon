const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { asyncHandler, serialize } = require('./shared');
const { toFrontendUser } = require('./shared');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { profile: true },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return res.json({
    token,
    user: serialize({
      id: user.id,
      ...toFrontendUser(user),
    }),
  });
});

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, department, position } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return res.status(409).json({ message: 'An account with this email already exists' });
  const count = await prisma.user.count();
  const user = await prisma.user.create({
    data: {
      employeeId: employeeId || `EMP-${Date.now()}`,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      role: count === 0 ? 'hr' : 'employee',
      profile: { create: { fullName: name, department: department || null, designation: position || null } },
    },
    include: { profile: true },
  });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: toFrontendUser(user), notice: 'Account created successfully.' });
});

const logout = asyncHandler(async (req, res) => res.status(204).send());

module.exports = {
  login,
  signUp,
  logout,
};
