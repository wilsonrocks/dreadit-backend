const app = require('express').Router();
const controllers = require('../controllers/topics.controllers');

app.get('', controllers.fetchAll);

module.exports = app;