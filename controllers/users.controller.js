const {User} = require('../models');

function fetchUser (req, res, next) {
    const {username} = req.params;
    
    User
    .findOne({username})
    .lean()
    .then(user => {
        if (user === null) throw new Error('userDoesNotExist');
        res
            .status(200)
            .send({user});
    })
    .catch(err => {
        if (err.message === 'userDoesNotExist') return res
            .status(404)
            .send({
                status: 404,
                message: `User with username ${username} does not exist.`});
        return next(err);
    });
}

module.exports = {fetchUser};
