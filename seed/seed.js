const mongoose = require('mongoose');
const models = require('../models');

function getID (collection, key, value) {
    // returns the objectID from the given collection when the value given by key matches value.
    // returns null if not there.
    const answer =  collection.filter(x => x[key] === value)[0]
    return answer ? answer._id : null;
}



async function init () {
    await mongoose.connect('mongodb://localhost/northcodersNews');
    await mongoose.connection.dropDatabase();
    const users = await models.User.insertMany(require('./devData/users.json'));
    const topics = await models.Topic.insertMany(require('./devData/topics.json'));
    const rawArticles = require('./devData/articles.json');
    const rawComments = require('./devData/comments.json');

    let articles = rawArticles.map(function(obj) {
        return {...obj,
            created_by: getID(users, 'username', obj.created_by),
            belongs_to: getID(topics, 'slug', obj.topic),
        };
    });

    articles = await models.Article.insertMany(articles);

    mongoose.disconnect();
}

init()
.catch(err => console.log(err));
