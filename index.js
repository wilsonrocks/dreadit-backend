const app = require('express')();

const middleware = require('./middleware');

const PORT = 3000;

app.use(middleware.logToScreen);
app.use(middleware.bodyParser);
app.use(middleware.jsonChecker);

app.get('/api', function (req, res, next) {
    return res.sendFile('./doc.html', {root:__dirname});
})


app.use(middleware.handleError);

if(process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log('NorthCoders News Server');
        console.log(`Listening on port ${PORT}`);
    });
}


module.exports = app;