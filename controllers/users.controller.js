const {User, Article} = require('../models');

function getAllUsers (req, res, next) {
    return User.find({})
    .lean()
    .then(users => {
        res
            .status(200)
        .send({users})
    });
}

function fetchUser (req, res, next) {
    const {_id} = req.params;

    return User
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
                message: `${_id} is not a valid user ID`,
            });
        if (err.message === 'userDoesNotExist') return res
            .status(404)
            .send({
                status: 404,
                message: `User with id ${_id} does not exist.`});
        return next(err);
    });
}

function fetchArticlesForUser (req, res, next) {
    const {_id: created_by} = req.params;
        return User.findById(created_by)
        .then(response => {
            if (response === null) throw new Error('userDoesNotExist');
            else return Article.find({created_by}).lean()
        })
        .then(articles => res.send({articles}))
        .catch(error => {

            if (error.name === 'CastError') return res
            .status(400)
            .send({
                status: 400,
                message: `${created_by} is not a valid user ID`,
            });

            if (error.message === 'userDoesNotExist') return res
            .status(404)
            .send({
                status: 404,
                message: `User with id ${created_by} does not exist.`});

            return next(error)
        });
}

module.exports = {
    fetchUser,
    getAllUsers,
    fetchArticlesForUser,
};
