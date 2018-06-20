const mongoose = require('mongoose');

const jsons = require('./devData');
const seed = require('./seedDB');


mongoose.connect('mongodb://localhost/northcoders_news_dev')
.then(() => mongoose.connection.dropDatabase())
.then(() => seed(jsons))
.then(() => mongoose.disconnect())
.then(() => console.log('Database seeded.'))
.catch(err => console.error(err));