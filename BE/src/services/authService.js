const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../app/model/User');
require('dotenv').config();

let refreshTokenArr = [];

let registerUser = data => {
	return new Promise(async (resolve, reject) => {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(data.password, salt);

			// Create a new user
			const user = await User.create({
				username: data.username,
				email: data.email,
				password: hashed,
			});
			resolve({
				msg: 'Create successfully!!!',
				data: user,
			});
		} catch (e) {
			reject(e);
		}
	});
};

let loginUser = (data, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({
				username: data.username,
			});
			if (!user) {
				// console.log(user);
				resolve({
					msg: 'User not found!!!',
					data: [],
				});
			}
			const isValid = await bcrypt.compare(data.password, user.password);
			if (!isValid) {
				// console.log(user);
				resolve({
					msg: 'Wrong password!!!',
					data: [],
				});
			}
			if (user && isValid) {
				const accessToken = generateAccessToken(user);
				const refreshToken = generateRefreshToken(user);
				refreshTokenArr.push(refreshToken); // tạm coi là lưu vào db riêng
				// gán refresh token vào cookie
				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					path: '/',
					sameSite: 'strict',
					secure: false, // TODO: false for dev
				});
				const { password, ...others } = user._doc;
				resolve({
					msg: 'Login successfully!!!',
					...others,
					accessToken: accessToken,
					// refreshToken: refreshToken,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

// generate access token
let generateAccessToken = user => {
	return jwt.sign(
		{
			id: user._id,
			admin: user.admin,
		},
		process.env.JWT_ACCESS_KEY,
		{ expiresIn: '20s' }
	);
};
// generate refresh token
let generateRefreshToken = user => {
	return jwt.sign(
		{
			id: user._id,
			admin: user.admin,
		},
		process.env.JWT_REFRESH_KEY,
		{ expiresIn: '365d' }
	);
};

// thường dùng redis để lưu
let requireRefreshToken = (req, res) => {
	return new Promise((resolve, reject) => {
		try {
			// take refresh token from cookie
			const refreshToken = req.cookies.refreshToken;
			if (!refreshToken) {
				resolve({
					msg: "You're not authorized!!!",
					sttCode: 401,
				});
			}
			if (!refreshTokenArr.includes(refreshToken)) {
				resolve({
					msg: "Refresh token is not valid, \nYou're not authorized!!!",
					sttCode: 403,
				});
			}
			jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
				if (err) {
					resolve({
						msg: err,
					});
				}

				// lọc token cũ ra khỏi mảng
				refreshTokenArr = refreshTokenArr.filter(
					token => token !== refreshToken
				);
				// create new access token and refresh token
				const newRefreshToken = generateRefreshToken(user);
				const newAccessToken = generateAccessToken(user);
				refreshTokenArr.push(newRefreshToken);
				// gán refresh token vào cookie
				res.cookie('refreshToken', newRefreshToken, {
					httpOnly: true,
					path: '/',
					sameSite: 'strict',
					secure: false, // TODO: false for dev
				});
				resolve({ accessToken: newAccessToken });
			});
		} catch (e) {
			reject(e);
		}
	});
};

let logoutUser = (req, res) => {
	return new Promise((resolve, reject) => {
		try {
			res.clearCookie('refreshToken');
			refreshTokenArr = refreshTokenArr.filter(
				token => token !== req.cookies.refreshToken
			);
			resolve({
				msg: 'Logout successfully!!!',
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = { registerUser, loginUser, requireRefreshToken, logoutUser };

/** STORE TOKEN
 * 1. local storage (dễ bị tấn công XSS)
 * 2. HTTPONLY cookies (ít bị ảnh hưởng bởi XSS, nhưng lại bị CSRF -> SAMESITE)
 * 3. redux store để lưu access token và httponly cookies để lưu refresh token
 */

// BFF pattern (BE for FE) (tìm hiểu thêm)
