const app = require('express')();
const mongoose = require('mongoose');
const middleware = require('./middleware');
const apiRouter = require('./routes/api.routes');
const {MONGO_URL} = require('./config');

const PORT = process.env.PORT || 3000;

app.use(middleware.logToScreen);
app.use(middleware.bodyParser);
app.use(middleware.jsonChecker);

app.use('/api', apiRouter);


app.use(middleware.handleError);

module.exports = app;