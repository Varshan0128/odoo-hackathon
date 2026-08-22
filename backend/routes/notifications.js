const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { listNotifications } = require('../controllers/notificationsController');

const router = Router();

router.get('/', authMiddleware, listNotifications);

module.exports = router;
