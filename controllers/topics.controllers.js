const {Article, User, Comment, Topic} = require('../models');
const {articleFilter, topicFilter} = require('../helpers');

function fetchAll (req, res, next) {
    console.log('hiya');
    console.log(require('mongoose').connection.readyState);
    
    Topic.find()
    .then(data => {
        return res.status(200).send(
            {topics: data.map(topicFilter)}
        );
    });
}

function fetchArticlesForTopic (req, res, next) {
    const _id = req.params.id;
    Topic.findOne({_id})
    .select()
    .then(data => {
        if (data === null) throw 'topicDoesNotExist';
        return Article.find({belongs_to:_id})
    })   
    .then(data => ({articles: data.map(articleFilter)}))
    .then(data => {
        const counts = Promise.all(data.articles.map(d => Comment.count({_id: d._id})));
        return Promise.all([data, counts]);
    })
    .then(function ([data, counts]) {
        return data.articles.map((d, index) => {
            return {...d, commentCount:counts[index]};
        })
    })
    .then((data) => ({articles: data}))
    .then(data => res.send(data))
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

    const topic = req.params._id;
    if (!req.body.title) return next({status:400, message: `Request body is missing a title field`});
    if (!req.body.body) return next({status:400, message: `Request body is missing a title field`});

    Topic.findById(topic)
    .then(data => {
        if (data === null) throw 'topicDoesNotExist';
        return User.findOne();
    })
    .then(user => {
        return Article.create(
            {
                ...req.body,
                belongs_to: topic,
                created_by: user._id,
            }
        );
    })
    .then(data => {
        res
        .status(201)
        .send({created: articleFilter(data)});
    })
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message:`Topic id ${topic} is invalid.`})
        if (err === 'topicDoesNotExist') return next({status:404, message: `Topic with id ${topic} does not exist`});
        console.error(err);
        return next({status:500, message:'Something Went Wrong'});
    })
}


module.exports = {fetchAll, fetchArticlesForTopic, createArticle};