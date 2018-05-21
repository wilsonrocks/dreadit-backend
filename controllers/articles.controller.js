const {Article} = require('../models');
const articleFields = ['_id', 'votes', 'title', 'created_by', 'body', 'belongs_to'];

function fetchAllArticles (req, res, next) {
    Article.find({})
    .select(articleFields)
    .then(data => res.status(200).send({articles:data}))
    .catch(err => {
        console.error(err);
        return next({status:500, message:'Something went wrong!'});
    })
}

function fetchSpecificArticle (req, res, next) {
    const {_id} = req.params;    
    Article.findOne({_id})
    .select(articleFields)
    .then(data => {
        if (data === null) throw 'articleDoesNotExist';
        res.send({article: data});
    })
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message:`Id ${_id} is not valid.`});
        if (err === 'articleDoesNotExist') return next({status:404, message:`Article with id ${_id} does not exist`});
        console.error(err);
        return next({status:500, message:'Something went wrong!'});
    });
}

module.exports = {fetchAllArticles, fetchSpecificArticle};

