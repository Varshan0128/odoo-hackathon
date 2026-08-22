const prisma = require('../config/prisma');
const { asyncHandler, toFrontendUser } = require('./shared');

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { profile: true },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: toFrontendUser(user) });
});

module.exports = {
  getMe,
};
