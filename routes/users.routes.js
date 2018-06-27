const router = require('express').Router();
const {fetchUser} = require('../controllers/users.controller');

router.get('/:_id', fetchUser);


module.exports = router;