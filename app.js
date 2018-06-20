const app = require('express')();
const mongoose = require('mongoose');
const middleware = require('./middleware');
const apiRouter = require('./routes/api.routes');

require('./env');

app.use(middleware.logToScreen);
app.use(middleware.bodyParser);
app.use(middleware.jsonChecker);
if (process.env.NODE_ENV !== 'test') mongoose.connect(process.env.MONGODB_URI);

app.use('/api', apiRouter);


app.use(middleware.handleError);

module.exports = app;