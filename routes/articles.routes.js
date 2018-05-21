const app = require('express').Router();

const {
    fetchAllArticles,
    fetchSpecificArticle,
    fetchCommentsForArticle} = require('../controllers/articles.controller');

app.get('', fetchAllArticles);
app.get('/:_id', fetchSpecificArticle);
app.get('/:_id/comments', fetchCommentsForArticle)


module.exports = app;