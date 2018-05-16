const mongoose = require('mongoose');
const models = require('../models');





async function init () {
    await mongoose.connect('mongodb://localhost/northcodersNews');
    await mongoose.connection.dropDatabase();
    await models.User.insertMany(require('./devData/users.json'));
    await models.Topic.insertMany(require('./devData/topics.json'));
    // await models.Article.insertMany(
    //     require('./devData/articles.json').map(
    //         function(input) {
    //             return {...input, belongs_to: input.topic};
    //         }));
    mongoose.disconnect();
}

init()
.catch(err => console.log(err));
