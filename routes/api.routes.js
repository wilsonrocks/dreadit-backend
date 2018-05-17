const router = require('express').Router();

router.get('', function (req, res, next) {
    return res.sendFile('./doc.html', {root:__dirname});
});

router.use('/users', require('./users.routes'));
router.use('/topics', require('./topics.routes'));
router.use('/comments', require('./comments.routes'));
router.use('/articles', require('./articles.routes'));

module.exports = router;