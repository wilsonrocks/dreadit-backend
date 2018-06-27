const {Comment} = require('../models');

function changeVoting(req, res, next) {
    const {_id} = req.params;
    const {vote} = req.query;
    if (vote === undefined) throw 'noVote';

    Comment.findById(_id)
    .lean()
    .then(comment => {
        if (comment === null) throw 'commentDoesNotExist';
        const votesDelta = {up: 1, down: -1}[vote] || 0;
        return Comment.findByIdAndUpdate(
            comment._id,
            {votes: comment.votes + votesDelta},
            {new: true}
        );
    })
    .then(comment => {
        return res.send({comment})
    })
    .catch(err => {
        if (err.name === 'CastError') return res
        .status(400)
        .send({
            status:400,
            message:`Comment id ${_id} is not valid.`});

        if (err === 'commentDoesNotExist') return res
        .status(404)
        .send({
            status:404,
            message:`Comment with id ${_id} does not exist`});

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

function deleteComment (req, res, next) {
    const {_id} = req.params;
    
    Comment
    .findByIdAndRemove(_id)
    .lean()
    .then(deleted => {
        if (deleted === null) throw 'invalidCommentId';
        return res.send({deleted});
    })
    .catch(err => {
        if (err.name === 'CastError') return res
        .status(400)
        .send({
            status:400,
            message: `${_id} is not a valid comment id.`});
        if (err === 'invalidCommentId') return res
        .status(404)
        .send({
            status:404,
            message:`Comment with id ${_id} does not exist`});
        
        return next(err);
    });
}

module.exports = {changeVoting, deleteComment};