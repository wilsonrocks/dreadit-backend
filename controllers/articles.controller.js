const {Article, Comment} = require('../models');
const {articleFilter, commentFilter} = require('../helpers');

function fetchAllArticles (req, res, next) {
    Article.find({})
    .then(data => {
        return res
        .status(200)
        .send({articles: data.map(articleFilter)});
    })
    .catch(err => {
        console.error(err);
        return next({status:500, message:'Something went wrong!'});
    })
}

function fetchSpecificArticle (req, res, next) {
    const {_id} = req.params;    
    Article.findOne({_id})
    .then(data => {
        if (data === null) throw 'articleDoesNotExist';
        res.send({article: articleFilter(data)});
    })
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message:`Id ${_id} is not valid.`});
        if (err === 'articleDoesNotExist') return next({status:404, message:`Article with id ${_id} does not exist`});
        console.error(err);
        return next({status:500, message:'Something went wrong!'});
    });
}

function fetchCommentsForArticle (req, res, next) {
    const {_id} = req.params;
    Comment.find({belongs_to: _id})
    .then(data => {
        return res.send({
            comments: data.map(commentFilter)
        });
    })
    .catch(err => console.error(err));

}

module.exports = {fetchAllArticles, fetchSpecificArticle, fetchCommentsForArticle};

