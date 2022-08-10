const jwt = require('jsonwebtoken');

class AuthMiddleware {
	verifyToken = (req, res, next) => {
		const token = req.headers.token;
		if (token) {
			const accessToken = token.split(' ')[1];
			jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
				if (err) {
					return res.status(403).json({
						msg: 'Invalid token',
					});
				}
				req.user = user;
				next();
			});
		} else {
			return res.status(401).json({
				msg: 'No token provided',
			});
		}
	};

	verifyAdmin = (req, res, next) => {
		this.verifyToken(req, res, () => {
			if (req.user.id == req.params.id || req.user.admin) {
				next();
			} else {
				return res.status(403).json({
					msg: 'You are not authorized to do this action',
				});
			}
		});
	};
}

module.exports = new AuthMiddleware();
