const router = require('express').Router();

router.get('', function (req, res, next) {
    return res.sendFile('./doc.html', {root:__dirname});
})

module.exports = router;