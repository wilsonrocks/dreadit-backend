const mongoose = require('mongoose');
const {Article, Topic, User, Comment} = require('../models');

function getID (collection, key, value) {
    // returns the objectID from the given collection when the value given by key matches value.
    // returns null if not there.
    const answer =  collection.filter(x => x[key] === value)[0]
    return answer ? answer._id : null;
}

function seedDatabase (tag) {

    const users = User.insertMany(require(`${__dirname}/${tag}Data/users.json`));
    const topics = Topic.insertMany(require(`${__dirname}/${tag}Data/topics.json`));

    return Promise.all([users, topics])
    .then(function addArticles ([users, topics]) {
        const articles = Article.insertMany(
            require(`${__dirname}/${tag}Data/articles.json`)
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
        const comments = Comment.insertMany(
            require(`${__dirname}/${tag}Data/comments.json`)
            .map(function (obj) {
                return {...obj,
                    belongs_to: getID(articles, 'title', obj.belongs_to),
                    created_by: getID(users, 'username', obj.created_by)
                };
            })
        );
        return Promise.all([users, topics, articles, comments]);
    })
    .then(([users, topics, articles, comments]) => {
        return {users, topics, articles, comments};
    })
    .catch(err => console.error(err));
}

module.exports = seedDatabase;