const { Router } = require('express');
const { login, signUp, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { getMe } = require('../controllers/usersController');

const router = Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
