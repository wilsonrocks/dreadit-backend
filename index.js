const app = require('express')();
const mongoose = require('mongoose');
const middleware = require('./middleware');
const apiRouter = require('./routes/api.routes');



const PORT = 3000;

app.use(middleware.logToScreen);
app.use(middleware.bodyParser);
app.use(middleware.jsonChecker);

app.use('/api', apiRouter);


app.use(middleware.handleError);

if(process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/northcoders_news_dev');
    app.listen(PORT, () => {
        console.log('NorthCoders News Server');
        console.log(`Listening on port ${PORT}`);
    });
}


module.exports = app;