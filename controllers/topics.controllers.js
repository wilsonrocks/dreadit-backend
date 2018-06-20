const {Article, User, Comment, Topic} = require('../models');

function fetchAll (req, res, next) {
    Topic
    .find()
    .lean()
    .then(topics => {
        return res.status(200).send({topics});
    });
}

function fetchArticlesForTopic (req, res, next) {
    const {_id} = req.params;
    Topic
    .findById(_id)
    .lean()
    .then(topic => {
        if (topic === null) throw 'topicDoesNotExist';
        return Article.find({belongs_to: _id}).lean()
    })   
    .then(articles => {
        const counts = Promise.all(articles.map(d => Comment.count({_id: d._id})));
        return Promise.all([articles, counts]);
    })
    .then(function ([articles, counts]) {
        return articles.map((d, index) => {
            return {...d, commentCount:counts[index]};
        })
    })
    .then(articles => res.send({articles}))
    .catch(err => {
        if (err === 'topicDoesNotExist') {
            return next({status:404, message: `There is no topic with id ${_id} to find articles for`});
        }

        if (err.name === 'CastError') {
            return next({status:400, message: `Invalid id ${_id} for topic`})
        }

        console.error(err);
        return next({status:500, message:'Something Went Wrong!'});
    });
}

function createArticle(req, res, next) {

    const {_id} = req.params;
    const {title, body} = req.body;

    if (!title) return next({status:400, message: `Request body is missing a title field`});
    if (!body) return next({status:400, message: `Request body is missing a title field`});

    Topic
    .findById(_id)
    .lean()
    .then(data => {
        if (data === null) throw 'topicDoesNotExist';
        return User.findOne(); //creataing by a random user
    })
    .then(user => {
        return Article.create(
            {
                ...req.body,
                belongs_to: _id,
                created_by: user._id,
            }
        );
    })
    .then(data => {
        res
        .status(201)
        .send({created: data});
    })
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message:`Topic id ${_id} is invalid.`})
        if (err === 'topicDoesNotExist') return next({status:404, message: `Topic with id ${_id} does not exist`});
        console.error(err);
        return next({status:500, message:'Something Went Wrong'});
    })
}

module.exports = {fetchAll, fetchArticlesForTopic, createArticle};
