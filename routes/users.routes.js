const router = require('express').Router();
const {fetchUser} = require('../controllers/users.controller');

router.get('/:username', fetchUser);


module.exports = router;