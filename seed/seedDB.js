const mongoose = require('mongoose');

const {Article, Topic, User, Comment} = require('../models');

function getID (collection, key, value) {
    // returns the objectID from the given collection when the value given by key matches value.
    // returns null if not there.
    const answer =  collection.filter(x => x[key] === value)[0]
    return answer ? answer._id : null;
}

function seed ({userJSON, topicsJSON, articlesJSON, commentsJSON}) {
    /* uses the existing mongoose connection to drop and seed the database
    using the supplied JSON data */

    const users = User.insertMany(userJSON); //these two don't depend on anything else
    const topics = Topic.insertMany(topicsJSON);

    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([users, topics])
    })
    //add articles based on the ids that mongo assigns for the relevant user and topic
    .then(function addArticles ([users, topics]) {
        const articles = Article.insertMany(
            articlesJSON
            .map(function(obj) {
                return {...obj,
                    created_by: getID(users, 'username', obj.created_by),
                    belongs_to: getID(topics, 'slug', obj.topic),
                };
            })
        );
        return Promise.all([users, topics, articles]);
    })
    .then(function addComments ([users, topics, articles]) {
        //add comments based on the IDs that mongo assigns for user, topic, article
        const comments = Comment.insertMany(
            commentsJSON
            .map(function (obj) {
                return {...obj,
                    belongs_to: getID(articles, 'title', obj.belongs_to),
                    created_by: getID(users, 'username', obj.created_by)
                };
            })
        );
        return Promise.all([users, topics, articles, comments]);
    })
    .then(([users, topics, articles, comments]) =>  {
        return {users, topics, articles, comments};
    })
    .catch(err => console.error(err));
}

module.exports = seed;
