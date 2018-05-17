const mongoose = require('mongoose');
const fs = require('fs');
const models = require('../models');

const tag = process.argv[2];

function getID (collection, key, value) {
    // returns the objectID from the given collection when the value given by key matches value.
    // returns null if not there.
    const answer =  collection.filter(x => x[key] === value)[0]
    return answer ? answer._id : null;
}

async function seedDatabase (tag) {
    try {
        console.log('Checking JSON data is present...');

        const usersPath = `${__dirname}/${tag}Data/users.json`;
        const topicsPath = `${__dirname}/${tag}Data/topics.json`;
        const articlesPath = `${__dirname}/${tag}Data/articles.json`;
        const commentsPath = `${__dirname}/${tag}Data/comments.json`;

        [usersPath, topicsPath, articlesPath, commentsPath].forEach(
            function(path) {
                if (!fs.existsSync(path)) throw `Required JSON file ${path} not present`;
            }
        )

        console.log('Connecting to Mongo');

        await mongoose.connect(`mongodb://localhost/northcoders_news_${tag}`);
        await mongoose.connection.dropDatabase();

        console.log('Seeding users...');
        const users = await models.User.insertMany(require(usersPath));
        console.log('Seeding topics...')
        const topics = await models.Topic.insertMany(require(topicsPath));

        const rawArticles = require(articlesPath);
        let articles = rawArticles.map(function(obj) {
            return {...obj,
                created_by: getID(users, 'username', obj.created_by),
                belongs_to: getID(topics, 'slug', obj.topic),
            };
        });
        console.log('Seeding articles...');
        articles = await models.Article.insertMany(articles);

        const rawComments = require(commentsPath);
        let comments = rawComments.map(function (obj) {
            return {...obj,
                belongs_to: getID(articles, 'title', obj.belongs_to),
                created_by: getID(users, 'username', obj.created_by)
            };
        });
        console.log('Seeding comments...')
        comments = await models.Comment.insertMany(comments);
    }

    catch (err) {
        console.error(err);
    }

    finally {
        console.log('Disconnecting from Mongo...')
        mongoose.disconnect();
    }
}

seedDatabase(tag)
.catch(function(err) {
    mongo.disconnect();
});
