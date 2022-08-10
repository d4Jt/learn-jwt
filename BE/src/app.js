const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const db = require('./config/db/connect');
const routes = require('./routes/index');

db.connect();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


app.listen(8000, () => {
	console.log('Server started on port 8000');
});

// authentication
// authorization (chức năng phân quyền)