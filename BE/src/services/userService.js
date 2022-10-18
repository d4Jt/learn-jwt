const User = require('../app/model/User');

let getAllUsers = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.find();
			resolve({
				msg: 'Get all users successfully!!!',
				data: user,
			});
		} catch (e) {
			reject(e);
		}
	});
};

let deleteUser = idInput => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findByIdAndDelete(idInput);
			if (!user) {
				resolve({
					msg: 'User not found!!!',
				});
			} else {
				resolve({
					msg: 'Delete user successfully!!!',
					data: user,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = { getAllUsers, deleteUser };
