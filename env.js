const constants = require('./constants.json');

if (process.env.NODE_ENV === 'test') process.env.MONGODB_URI = constants.MONGODB_URI_TEST;
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = constants.MONGODB_URI_DEV;
if (!process.env.PORT) process.env.PORT = constants.DEFAULT_PORT;
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';