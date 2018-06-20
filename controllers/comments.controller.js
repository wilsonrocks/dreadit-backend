const {Comment} = require('../models');

function changeVoting(req, res, next) {
    const {_id} = req.params;
    const {vote} = req.query;
    if (vote === undefined) throw 'noVote';

    Comment.findById(_id)
    .then(comment => {
        if (comment === null) throw 'commentDoesNotExist';
        if (vote === 'up') comment.votes++;
        else if (vote === 'down') comment.votes--;
        else throw 'invalidVote'

        return comment.save();
    })
    .then(comment => {
        return res.send({comment})
    })
    .catch(err => {
        if (err.name === 'CastError') return next({
            status:400, message:`Comment id ${_id} is not valid.`
        });
        if (err === 'commentDoesNotExist') return next({
            status:404, message:`Comment with id ${_id} does not exist`
        });
        if (err === 'noVote') return next({
            status: 400, message: '"vote" querystring is missing, value should be "up" or "down"'
        });
        if (err === 'invalidVote') return next({
            status:400, message:`"vote" querystring value ${req.query.vote} is invalid - must be "up" or "down"`
        });

        console.error(err)
        return next({status:500, message:'Something Went Wrong'});
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
        if (err.name === 'CastError') return next({status:400, message: `${_id} is not a valid comment id.`});
        if (err === 'invalidCommentId') return next({status:404, message:`Comment with id ${_id} does not exist`});
        console.error(err);
        return next({status:500, message:'Something went wrong'});
    });
}

module.exports = {changeVoting, deleteComment};