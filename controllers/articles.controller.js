const {Article, Comment, User} = require('../models');

function fetchAllArticles (req, res, next) {
    Article
    .find({})
    .lean()
    .then(articles => {
        const output = articles.map(article => {
            return Promise.all([article, Comment.count({belongs_to: article._id})])
        });
        return Promise.all(output);
    })
    .then(articles => {
        return articles.map(
            ([article, count]) => {
                return ({...article, commentCount: count});
            });
    })
    .then(articles => {
        return res
        .status(200)
        .send({articles});
    })
    .catch(next);
}

function fetchSpecificArticle (req, res, next) {
    const {_id} = req.params;
    Article.findOne({_id})
    .then(article => {
        if (article === null) throw 'articleDoesNotExist';
        res.send({article});
    })
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message:`Id ${_id} is not valid.`});
        if (err === 'articleDoesNotExist') return res
            .status(404)
            .send({
                status:404,
                message:`Article with id ${_id} does not exist`});
        return next(err);
    });
}

function fetchCommentsForArticle (req, res, next) {
    const {_id} = req.params;
    Comment.find({belongs_to: _id})
    .then(comments => {
        return res.send({
            comments: comments
        });
    })
    .catch(next);
}

function createComment (req, res, next) {

    const article = req.params._id;
    const body = req.body.comment;

    Promise.all([User.findOne(), Article.findById(article)]) //random user to create comment
    .then(([user, article]) => {
        if (article === null) throw 'articleDoesNotExist';
        if (body === undefined) throw 'noComment';
        return Comment.create({
            body,
            belongs_to: article._id,
            created_by: user._id
        })
    })
    .then(created =>
        res
        .status(201)
        .send({created}))
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message: `Article id ${article} is invalid`});

        if (err === 'articleDoesNotExist') return res
        .status(404)
        .send({
                status: 404,
                message: `There is no article with id ${article}.`});

        if (err === 'noComment') return res
        .status(400)
        .send({
            status: 400,
            message: 'The request body must contain a comment field'});
        return next(err);
    });
}

function changeVoting(req, res, next) {
    const article = req.params._id;
    const {vote} = req.query;

    Article.findById(article)
    .then(article => {
        if (article === null) throw 'articleDoesNotExist';
        if (vote === undefined) throw 'noVote';

        else if (vote === 'up') article.votes++;
        else if (vote === 'down') article.votes--;
        else throw 'invalidVote'

        return article.save();
    })
    .then(article => {
        return res.send({article})
    })
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message:`Article id ${article} is not valid.`});

        if (err === 'articleDoesNotExist') return res
        .status(404)
        .send({
            status:404,
            message:`Article with id ${article} does not exist`});

        if (err === 'noVote') return res
            .status(400)
            .send({
                status: 400,
                message: '"vote" querystring is missing, value should be "up" or "down"'});

        if (err === 'invalidVote') return res
        .status(400)
        .send({
            status:400,
            message:`"vote" querystring value ${req.query.vote} is invalid - must be "up" or "down"`});

        return next(err);
    });
}

module.exports = {
    fetchAllArticles,
    fetchSpecificArticle,
    fetchCommentsForArticle,
    createComment,
    changeVoting,
};
