function logToScreen (req, res, next) {
    const logOutput = `${Date().toString()} ${req.method} ${req.originalUrl}`;
    console.log(logOutput);
    return next();
}

function jsonChecker (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.send({status:400, message:'Bad JSON'});
    }
    else next();
}


const bodyParser = require('body-parser').json();

module.exports = {logToScreen, bodyParser, jsonChecker};
