const app = require('./app');
const constants = require('./constants.json');

const PORT = process.argv[2] || constants.DEFAULT_PORT;

app.listen(PORT, function () {
    console.log(`Northcoders News`)
    console.log(`Listening on port ${PORT}...`);
});