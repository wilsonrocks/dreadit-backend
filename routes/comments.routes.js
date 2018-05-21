const router = require('express').Router();
const {changeVoting} = require('../controllers/comments.controller');

router.put('/:_id', changeVoting)

module.exports = router;
