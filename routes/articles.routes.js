const app = require('express').Router();

const controllers = require('../controllers/articles.controller');

app.get('', controllers.fetchAllArticles);
app.get('/:_id', controllers.fetchSpecificArticle);


module.exports = app;