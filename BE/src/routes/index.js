const authRouter = require('./auth');
const userRouter = require('./user');

const routes = (app) => {
   app.use('/v1/auth', authRouter);
   app.use('/v1/user', userRouter);
}

module.exports = routes;