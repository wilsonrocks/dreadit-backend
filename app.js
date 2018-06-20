const app = require('express')();
const mongoose = require('mongoose');
const {logToScreen, bodyParser, jsonChecker, handleError} = require('./middleware');
const apiRouter = require('./routes/api.routes');

require('./env');

if (process.env.NODE_ENV === 'dev') app.use(logToScreen);
//nobody will be checking the console in production

app.use(bodyParser);
app.use(jsonChecker);

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI)
    .catch((error) => {
        if (error.name === 'MongoNetworkError') {
            console.log('Error: Could not connect to mongoDB. Is mongod running?');
            process.exit();
        }
        else throw error;
    });
}

app.use('/api', apiRouter);
app.use(handleError);

module.exports = app;