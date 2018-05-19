const app = require('express').Router();
const controllers = require('../controllers/topics.controllers');

app.get('', controllers.fetchAll);
app.get('/:id/articles', controllers.fetchArticlesForTopic)

module.exports = app;