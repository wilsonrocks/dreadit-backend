const {Comment} = require('../models');
const {commentFilter} = require('../helpers');

function changeVoting(req, res, next) {
    const comment = req.params._id;
    Comment.findById(comment)
    .then(data => {
        if (data === null) throw 'commentDoesNotExist';
        const vote = req.query.vote;
        if (vote === undefined) throw 'noVote';
        else if (vote === 'up') data.votes++;
        else if (vote === 'down') data.votes--;
        else throw 'invalidVote'

        return data.save();
    })
    .then(data => {
        return res.send({comment: commentFilter(data)})
    })
    .catch(err => {
        if (err.name === 'CastError') return next({
            status:400, message:`Comment id ${comment} is not valid.`
        });
        if (err === 'commentDoesNotExist') return next({
            status:404, message:`Comment with id ${comment} does not exist`
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
    Comment.findByIdAndRemove(_id)
    .then(data => {
        if (data === null) throw 'invalidCommentId';
        return res.send({deleted: commentFilter(data)});
    })
    .catch(err => {
        if (err.name === 'CastError') return next({status:400, message: `${_id} is not a valid comment id.`});
        if (err === 'invalidCommentId') return next({status:404, message:`Comment with id ${_id} does not exist`});
        console.error(err);
        return next({status:500, message:'Something went wrong'});
    });
}

module.exports = {changeVoting, deleteComment};