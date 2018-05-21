const app = require('express').Router();

const {
    fetchAllArticles,
    fetchSpecificArticle,
    fetchCommentsForArticle,
    createComment} = require('../controllers/articles.controller');

app.get('', fetchAllArticles);
app.get('/:_id', fetchSpecificArticle);
app.get('/:_id/comments', fetchCommentsForArticle);
app.post('/:_id/comments', createComment);


module.exports = app;