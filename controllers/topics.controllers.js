const {Article, User, Comment, Topic} = require('../models');

function fetchAll (req, res, next) {
    Topic
    .find()
    .lean()
    .then(topics => {
        return res.status(200).send({topics});
    })
    .catch(next);
}

function fetchArticlesForTopic (req, res, next) {
    const {_id} = req.params;

    Topic.findById(_id)

    .then(topic => {
        if (topic === null) throw new Error('topicDoesNotExist');

        return Article
            .find({belongs_to: _id})
            .populate('created_by')
            .lean();
    })

    .then(articles => {

        const counts = Promise.all(articles.map(article => Comment.count({_id: article._id})));
        return Promise.all([articles, counts]);

    })

    .then(function ([articles, counts]) {

        const output = articles.map((article, index) => {
            return {...article, commentCount:counts[index]};
        });

        res.send({articles: output});
    })

    .catch(err => {

        if (err.name === 'CastError') {
            return res
                .status(400)
                .send({
                    status:400,
                    message: `Invalid id ${_id} for topic`
                });
        }

        if (err.message === 'topicDoesNotExist') {
            return res
                .status(404)
                .send({
                    status:404,
                    message: `There is no topic with id ${_id} to find articles for`
                });
        }

        else next(err);
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
        if (data === null) throw new Error('topicDoesNotExist');
        return User.findOne(); //creating by a random user
    })
    .then(user => {
        return Article.create(
            {
                ...req.body,
                belongs_to: _id,
                created_by: user._id,
            }
        )
        .then(article => article.populate('created_by').execPopulate())
    })
    .then(data => {
        res
        .status(201)
        .send({created: data});
    })
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message:`Topic id ${_id} is invalid.`});
        if (err.message === 'topicDoesNotExist') return res
            .status(404)
            .send({status:404, message: `Topic with id ${_id} does not exist`});
        return next(err);
    })
}

module.exports = {fetchAll, fetchArticlesForTopic, createArticle};
