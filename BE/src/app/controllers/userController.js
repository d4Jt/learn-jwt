const userService = require('../../services/userService');

class UserController {
	handleGetAllUsers = async (req, res, next) => {
		try {
			const response = await userService.getAllUsers();
			return res.status(200).json(response);
		} catch (e) {
			return res.status(500).json(e);
		}
	};

	handleDeleteUser = async (req, res, next) => {
		try {
			const response = await userService.deleteUser(req.params.id);
			return res.status(200).json(response);
		} catch (e) {
			return res.status(500).json(e);
		}
	};
}

module.exports = new UserController();
