const app = require('express').Router();
const {fetchAll, fetchArticlesForTopic, createArticle} = require('../controllers/topics.controllers');

app.get('', fetchAll);
app.get('/:id/articles', fetchArticlesForTopic);
app.post('/:_id/articles', createArticle);


module.exports = app;