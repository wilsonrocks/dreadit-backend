const mongoose = require('mongoose');

require('../env');

const jsons = require('./devData');
const seed = require('./seedDB');


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(`Seeding database at ${process.env.MONGODB_URI}...`))
.then(() => mongoose.connection.dropDatabase())
.then(() => seed(jsons))
.then(() => mongoose.disconnect())
.then(() => console.log('Seeded.'))
.catch(err => console.error(err));
