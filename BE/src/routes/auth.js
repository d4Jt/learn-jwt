const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/authController');
const authMiddleware = require('../app/middleware/authMiddleware');

router.post('/register', authController.handleRegisterUser);
router.get('/login', authController.handleLoginUser);
router.post(
	'/logout',
	authMiddleware.verifyToken,
	authController.handleLogoutUser
);

router.post('/refresh-token', authController.requireRefreshToken);

module.exports = router;
