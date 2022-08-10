const authService = require('../../services/authService');

class AuthController {
	// register
	handleRegisterUser = async (req, res, next) => {
		try {
			let response = await authService.registerUser(req.body);
			return res.status(200).json(response);
		} catch (e) {
			return res.status(500).json(e);
		}
	};

	// login
	handleLoginUser = async (req, res, next) => {
		try {
			let response = await authService.loginUser(req.body, res);
			return res.status(200).json(response);
		} catch (e) {
			return res.status(500).json(e);
		}
	};

   requireRefreshToken = async (req, res, next) => {
      try {
         let response = await authService.requireRefreshToken(req);
         return res.status(200).json(response);
      } catch (e) {
         return res.status(500).json(e);
      }
   }

   handleLogoutUser = async (req, res, next) => {
      try {
         let response = await authService.logoutUser(req, res);
         return res.status(200).json(response);
      } catch (e) {
         return res.status(500).json(e);
      }
   };
}

module.exports = new AuthController();
