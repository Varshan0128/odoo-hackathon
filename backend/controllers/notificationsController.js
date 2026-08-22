const prisma = require('../config/prisma');
const { asyncHandler, serialize } = require('./shared');

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ notifications: serialize(notifications) });
});

module.exports = {
  listNotifications,
};
