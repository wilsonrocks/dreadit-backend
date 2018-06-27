const router = require('express').Router();
const {fetchAll, fetchArticlesForTopic, createArticle} = require('../controllers/topics.controllers');

router.get('', fetchAll);
router.route('/:_id/articles')
    .get(fetchArticlesForTopic)
    .post(createArticle);


module.exports = router;