const {Article, Comment, User} = require('../models');
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
    .catch(err => {
        console.error(err)
        return next({status:500, message:'Something went wrong!'});
    });
}

function createComment (req, res, next) {
    const article = req.params._id;
    Promise.all([User.findOne(), Article.findById(article)])
    .then(([user, article]) => {
        if (article === null) throw 'articleDoesNotExist';
        if (req.body.comment === undefined) throw 'noComment';
        return Comment.create({
            body: req.body.comment,
            belongs_to: article._id,
            created_by: user._id
        })
    })
    .then(data => 
        res
        .status(201)
        .send({created: commentFilter(data)}))
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message: `Article id ${article} is invalid`});
        if (err === 'articleDoesNotExist') return next({status: 404, message: `There is no article with id ${article}.`});
        if (err === 'noComment') return next({status: 400, message: 'The request body must contain a comment field'});
        console.error(err)
        return next({status:500, message:'Something went wrong!'});
    });
}

module.exports = {
    fetchAllArticles,
    fetchSpecificArticle,
    fetchCommentsForArticle,
    createComment,};

