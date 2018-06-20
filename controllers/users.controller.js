const {User} = require('../models');

function fetchUser (req, res, next) {
    const {username} = req.params;
    
    User
    .findOne({username})
    .lean()
    .then(user => {
        if (user === null) throw 'userDoesNotExist';
        res
        .status(200)
        .send({user})
    })
    .catch(err => {
        if (err = 'userDoesNotExist') return next({status: 404, message: `User with username ${username} does not exist.`});
        console.error(err);
        return next({status:500, message:'Something Went Wrong'});
    });
}

module.exports = {fetchUser};
