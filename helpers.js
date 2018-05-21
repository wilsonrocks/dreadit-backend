const _ = require('lodash');

const topicFilter = topic => _.pick(topic, ['_id', 'title', 'slug']);
const articleFilter = article => _.pick(article, ['_id', 'title', 'body', 'belongs_to', 'votes', 'created_by']);

module.exports = {topicFilter, articleFilter}