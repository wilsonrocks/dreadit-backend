const {User} = require('../models');
const {userFilter} = require('../helpers');

function fetchUser (req, res, next) {
    const {username} = req.params;
    User.findOne({username})
    .then(user => {
        if (user === null) throw 'userDoesNotExist';
        res
        .status(200)
        .send({user: userFilter(user)})
    })
    .catch(err => {
        if (err = 'userDoesNotExist') return next({status: 404, message: `User with username ${username} does not exist.`});
        console.error(err);
        return next({status:500, message:'Something Went Wrong'});
    });
}

module.exports = {fetchUser};
