const express = require('express');
const authController = require('../app/controllers/authController');
const router = express.Router();

const userController = require('../app/controllers/userController');
const authMiddleware = require('../app/middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, userController.handleGetAllUsers);
router.delete(
	'/:id',
	authMiddleware.verifyAdmin,
	userController.handleDeleteUser
);

module.exports = router;
