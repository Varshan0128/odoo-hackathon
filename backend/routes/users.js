const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getMe } = require('../controllers/usersController');

const router = Router();

router.get('/me', authMiddleware, getMe);

module.exports = router;
