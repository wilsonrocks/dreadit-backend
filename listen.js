const app = require('./app');

const PORT = process.argv[2] || process.env.PORT;

app.listen(PORT, function () {
    console.log(`Northcoders News`)
    console.log(`Listening on port ${PORT}...`);
});