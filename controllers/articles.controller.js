const {Article, Comment, User} = require('../models');

function fetchAllArticles (req, res, next) {
    Article
    .find({})
    .populate('created_by')
    .lean()
    .then(articles => {
        const output = articles.map(article => {
            return Promise.all([article, Comment.count({belongs_to: article._id})])
        });
        return Promise.all(output);
    })
    .then(articles => {
        const output = articles.map(
            ([article, count]) => {
                return ({...article, commentCount: count});
            });
        return res
            .status(200)
            .send({articles: output})
    })
    .catch(next);
}

function fetchSpecificArticle (req, res, next) {
    const {_id} = req.params;
    Article.findOne({_id})
    .populate('created_by')
    .then(article => {
        if (article === null) throw new Error('articleDoesNotExist');
        res.send({article});
    })
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message:`Id ${_id} is not valid.`});
        if (err.message === 'articleDoesNotExist') return res
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

    if (body === undefined) return res
        .status(400)
        .send({
            status: 400,
            message: 'The request body must contain a comment field'
        });

    if (body === '') return res
        .status(400)
        .send({
            status: 400,
            message: 'The comment cannot be blank'
        });
    


    Promise.all([User.findOne(), Article.findById(article)]) //random user to create comment
    .then(([user, article]) => {
        if (article === null) throw new Error('articleDoesNotExist');
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

        if (err.message === 'articleDoesNotExist') return res
        .status(404)
        .send({
                status: 404,
                message: `There is no article with id ${article}.`});
        return next(err);

    });
}

function changeVoting(req, res, next) {
    const article = req.params._id;
    const {vote} = req.query;
    if (vote === undefined) return res
        .status(400)
        .send({
            status: 400,
            message: '"vote" querystring is missing, value should be "up" or "down"'
        });

    Article.findById(article)
    .lean()
    .then(article => {
        if (article === null) throw new Error('articleDoesNotExist');
        const votesDelta = {up: 1, down: -1}[vote] || 0;
        return Article.findByIdAndUpdate(
            article._id,
            {votes: article.votes + votesDelta},
            {new: true}
        );
    })
    .then(article => res.status(200).send({article}))
    .catch(err => {
        if (err.name === 'CastError') return res
            .status(400)
            .send({
                status:400,
                message:`Article id ${article} is not valid.`
            });

        if (err.message === 'articleDoesNotExist') return res
        .status(404)
        .send({
            status:404,
            message:`Article with id ${article} does not exist`});

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
