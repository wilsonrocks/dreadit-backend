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

mongoose.connect(MONGO_URL)
.then(() => {
    if (process.env.NODE_ENV === 'dev') {
        require('./seed/seed')('dev');
    }
})
.then(
    () => {
        if(process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
            console.log('NorthCoders News Server');
            console.log(`Listening on port ${PORT}`);
        });
    }
})
.catch(err => {
    if (err.name = 'MongoNetworkError') console.error('Something went wrong with connecting to mongoDB. Try typing mongod first.');
    else console.error(err);
    process.exit(); //make sure we exit
});


module.exports = app;