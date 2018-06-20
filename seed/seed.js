const mongoose = require('mongoose');

const jsons = require('./devData');
const seed = require('./seedDB');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/northcoders_news_dev';

mongoose.connect(MONGODB_URI)
.then(() => console.log(`Seeding database at ${MONGODB_URI}...`))
.then(() => mongoose.connection.dropDatabase())
.then(() => seed(jsons))
.then(() => mongoose.disconnect())
.then(() => console.log('Seeded.'))
.catch(err => console.error(err));
