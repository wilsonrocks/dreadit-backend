const _ = require('lodash');

const topicFilter = topic => _.pick(topic, ['_id', 'title', 'slug']);
const userFilter = user => _.pick(user, ['_id', 'name', 'username', 'avatar_url']);

const articleFilter = article => _.pick(article, ['_id', 'title', 'body', 'belongs_to', 'votes', 'created_by']);
const commentFilter = comment => _.pick(comment, ['created_at', '_id', 'body', 'belongs_to', 'created_by', 'votes']);

module.exports = {topicFilter, articleFilter, commentFilter, userFilter};