const router = require('express').Router();
const {fetchUser, getAllUsers} = require('../controllers/users.controller');

router.route('/:_id')
    .get(fetchUser);

router.route('')
    .get(getAllUsers);


module.exports = router;