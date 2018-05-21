const models = require('../models');
const _ = require('lodash');

function fetchAll (req, res, next) {
    models.Topic.find()
    .then(data => {
        return res.status(200).send(
            {topics: data.map(d => _.pick(d, ['_id', 'title', 'slug']))}
        );
    });
}

function fetchArticlesForTopic (req, res, next) {
    const id = req.params.id;
    models.Topic.findOne({_id:id})
    .select()
    .then(data => {
        if (data === null) throw 'topicDoesNotExist';
        return models.Article.find({belongs_to:id})
    })   
    .then(data => {
        data = data.map(d => _.pick(d, ['_id', 'votes', 'title', 'created_by', 'body', 'belongs_to']));
        res.send({articles:data});
    })
    .catch(err => {
        if (err === 'topicDoesNotExist') {
            return next({status:404, message: `There is no topic with id ${id} to find articles for`});
        }

        if (err.name === 'CastError') {
            return next({status:400, message: `Invalid id ${id} for topic`})
        }

        console.error(err);
        return next({status:500, message:'Something Went Wrong!'});
    });
}

module.exports = {fetchAll, fetchArticlesForTopic};