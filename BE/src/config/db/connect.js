const mongoose = require('mongoose');
require('dotenv').config();

let connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useCreateIndex: true,
			// useFindAndModify: false
		});
		console.log('MongoDB connected');
	} catch (e) {
		console.log('Connect error', e);
	}
};

module.exports = { connect };
