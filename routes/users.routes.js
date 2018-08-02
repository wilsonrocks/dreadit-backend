const router = require('express').Router();
const {
        fetchUser,
        getAllUsers,
        fetchArticlesForUser,
    } = require('../controllers/users.controller');

router.route('/:_id')
    .get(fetchUser);

router.route('/:_id/articles')
    .get(fetchArticlesForUser);

router.route('')
    .get(getAllUsers);


module.exports = router;