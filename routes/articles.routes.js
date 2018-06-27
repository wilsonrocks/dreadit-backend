const router = require('express').Router();

const {
    fetchAllArticles,
    fetchSpecificArticle,
    fetchCommentsForArticle,
    createComment,
    changeVoting,
} = require('../controllers/articles.controller');

router.get('', fetchAllArticles);
router
    .route('/:_id')
    .get(fetchSpecificArticle)
    .put(changeVoting);

router
    .route('/:_id/comments')
    .get(fetchCommentsForArticle)
    .post(createComment);


module.exports = router;