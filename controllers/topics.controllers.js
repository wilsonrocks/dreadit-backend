const models = require('../models');
const _ = require('lodash');

function fetchAll (req, res, next) {
    console.log('hi');
    models.Topic.find()
        .then(data => {
            data = data.map(obj => _.pick(obj, ['_id', 'title', 'slug']))

            return res.status(200).send(
                {topics: data}
            );
        });
    }

module.exports = {fetchAll};