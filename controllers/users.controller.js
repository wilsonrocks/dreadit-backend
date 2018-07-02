const {User} = require('../models');

function fetchUser (req, res, next) {
    const {_id} = req.params;
    
    User
    .findById(_id)
    .lean()
    .then(user => {
        if (user === null) throw new Error('userDoesNotExist');
        res
            .status(200)
            .send({user});
    })
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status: 400,
                message: `${_id} is not a valid ID`,
            });
        if (err.message === 'userDoesNotExist') return res
            .status(404)
            .send({
                status: 404,
                message: `User with id ${_id} does not exist.`});
        return next(err);
    });
}

module.exports = {fetchUser};
