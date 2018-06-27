const router = require('express').Router();
const {changeVoting, deleteComment} = require('../controllers/comments.controller');

router
    .route('/:_id')
    .put(changeVoting)
    .delete(deleteComment);

module.exports = router;
