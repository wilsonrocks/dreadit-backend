function logToScreen (req, res, next) {
    const logOutput = `${Date().toString()} ${req.method} ${req.originalUrl}`;
    console.log(logOutput);
    return next();
}

function handleError (errorObj, req, res, next) {
    if (errorObj.status) {
        return res.status(errorObj.status)
        .send(errorObj);
    }
    else next();
}

function jsonChecker (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.send({status:400, message:'Bad JSON'});
    }
    else next();
}


const bodyParser = require('body-parser').json();

module.exports = {logToScreen, handleError, bodyParser, jsonChecker};
