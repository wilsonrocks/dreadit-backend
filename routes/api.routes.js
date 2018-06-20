const router = require('express').Router();
const {resolve} = require('path');

router.get('', function (req, res, next) {
    return res.sendFile(resolve('public/doc.html'));
});

router.use('/users', require('./users.routes'));
router.use('/topics', require('./topics.routes'));
router.use('/comments', require('./comments.routes'));
router.use('/articles', require('./articles.routes'));

module.exports = router;