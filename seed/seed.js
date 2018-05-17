const mongoose = require('mongoose');
const models = require('../models');

function getID (collection, key, value) {
    // returns the objectID from the given collection when the value given by key matches value.
    // returns null if not there.
    const answer =  collection.filter(x => x[key] === value)[0]
    return answer ? answer._id : null;
}

async function seedDatabase (tag) {
    await mongoose.connect(`mongodb://localhost/northcoders_news_${tag}`);
    await mongoose.connection.dropDatabase();

    const users = await models.User.insertMany(require(`./${tag}Data/users.json`));
    const topics = await models.Topic.insertMany(require(`./${tag}Data/topics.json`));

    const rawArticles = require(`./${tag}Data/articles.json`);
    let articles = rawArticles.map(function(obj) {
        return {...obj,
            created_by: getID(users, 'username', obj.created_by),
            belongs_to: getID(topics, 'slug', obj.topic),
        };
    });
    articles = await models.Article.insertMany(articles);

    const rawComments = require(`./${tag}Data/comments.json`);
    let comments = rawComments.map(function (obj) {
        return {...obj,
            belongs_to: getID(articles, 'title', obj.belongs_to),
            created_by: getID(users, 'username', obj.created_by)
        };
    });
    comments = await models.Comment.insertMany(comments);

    mongoose.disconnect();
}

seedDatabase('dev')
.catch(err => console.log(err));
