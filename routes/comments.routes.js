const router = require('express').Router();
const {changeVoting, deleteComment} = require('../controllers/comments.controller');

router.put('/:_id', changeVoting)
router.delete('/:_id', deleteComment);

module.exports = router;
