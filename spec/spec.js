process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');

const seed = require('../seed/seedDB');
const app = require('../app.js');
const jsonData = require('../seed/testData');

const articleKeys = ['_id', 'title', 'body', 'belongs_to', 'votes', 'created_by'];
const commentKeys = ['created_at', '_id', 'body', 'belongs_to', 'created_by', 'votes'];
const userKeys = ['_id', 'username', 'name', 'avatar_url'];

require('../env');

describe('NorthCoders News API', function () {

    before(function () {
        return mongoose.connect(process.env.MONGODB_URI)
        .catch(error => {
            if (error.name === 'MongoNetworkError') {
                console.log('Error: Could not connect to mongoDB. Is mongod running?');
                process.exit();
            }
            else throw error;
        });
    });

    beforeEach(function () {
        return seed(jsonData)
        .then(output => {
            seedData = output;
        });
    });

    after(function () {
        return mongoose.disconnect();
    });

    describe('/api', function () {

        it('GET returns an HTML page with the documented endpoints', function () {
            return request(app)
                .get('/api')
                .expect(200)
                .then(res => {
                    expect(res.type).to.equal('text/html');
                });
        });
    });

    describe('/api/topics', function () {
        describe('GET', function () {
            it('Returns all the topics', function () {
                const seedTopics = seedData.topics;
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('topics');
                    expect(body.topics).to.be.an('array');
                    expect(body.topics.length).to.equal(seedTopics.length);
                    expect(body.topics[0]).to.be.an('object');
                    expect(body.topics[0]).to.include.keys('_id', 'title', 'slug');
                });
            });
        });
    });

    describe('/api/topics/:_id/articles', function () {
        describe('GET', function () {
            it('returns all the articles when the id is valid and present', function () {
                const articleNumber = 1;
                const testTopic = seedData.topics[articleNumber];
                const id = testTopic._id;
                const expectedArticles = seedData.articles.filter(x => x.belongs_to === id);

                return request(app)
                .get(`/api/topics/${id}/articles`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('articles');
                    expect(body.articles).to.be.an('array');
                    expect(body.articles.length).to.equal(expectedArticles.length);

                    const returnedArticle = body.articles[articleNumber];

                    expect(returnedArticle).to.include.keys(...articleKeys, 'commentCount');
                    expect(returnedArticle.commentCount).to.be.a('number');
                    expect(returnedArticle.commentCount).to
                        .equal(seedData.comments
                            .filter(comment => comment.belongs_to === returnedArticle._id).length);
                    expect(returnedArticle.belongs_to).to.equal(`${testTopic._id}`);
                });
            });
            it('Returns a 400 if id is not valid', function () {
                return request(app)
                .get('/api/topics/eeeee/articles')
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('Returns a 404 if id is valid but the topic is not in the database', function () {
                return request(app)
                .get('/api/topics/eeeeeeeeeeeeeeeeeeeeeeee/articles')
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                });
            });
        });
        describe('POST', function () {
            const testArticle = {title:'#nolivesmatter', body:'Ice-T really is very good, isn\'t he?'};
            it('creates a new article', function () {
                const topic = seedData.topics[0]._id;
                return request(app)
                .post(`/api/topics/${topic}/articles`)
                .send(testArticle)
                .expect(201)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('created');
                    const created = body.created;
                    expect(created).to.be.an('object');
                    expect(created).to.include.keys(articleKeys);
                    expect(created.votes).to.equal(0);
                    expect(created.belongs_to).to.equal(`${topic}`);
                });
            });
            it('returns a 400 if the topic is not valid', function () {
                return request(app)
                .post('/api/topics/FAKER/articles')
                .send(testArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns a 404 if the topic is valid but not there', function () {
                return request(app)
                .post('/api/topics/eeeeeeeeeeeeeeeeeeeeeeee/articles')
                .send(testArticle)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                })
            });
            it('returns a 400 if the title field is missing in the body', function () {
                const topic = seedData.topics[0]._id;
                return request(app)
                .post(`/api/topics/${topic}/articles`)
                .send({body: 'what?'})
                .expect(400);
            });
            it('returns a 400 if the body field is missing in the body', function () {
                const topic = seedData.topics[0]._id;
                return request(app)
                .post(`/api/topics/${topic}/articles`)
                .send({title: 'what?'})
                .expect(400);
            });
        });
    });

    describe('/api/articles', function () {
        describe('GET', function () {
            it('fetches all the articles', function () {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('articles');
                    expect(body.articles).to.be.an('array');
                    expect(body.articles).to.have.length(4);

                    const articleNumber = 2;
                    const requestedArticle = body.articles[articleNumber];
                    expect(requestedArticle).to.include.keys('_id', 'votes', 'title', 'created_by', 'body', 'belongs_to', 'commentCount');
                    expect(requestedArticle.commentCount).to.be.a('number');
                    expect(requestedArticle.commentCount).to
                    .equal(seedData.comments.filter(x => x.belongs_to === seedData.articles[articleNumber]._id).length);
                });
            });
        });
    });

    describe('/api/articles/:_id', function () {
        describe('GET', function () {
            it('fetches the specific article', function () {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(res => res.body.articles[0]._id)
                .then(id => request(app).get(`/api/articles/${id}`))
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('article');
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.include.keys('_id', 'votes', 'title', 'created_by', 'body', 'belongs_to');
                });
            });
            it('returns a 400 if the id is invalid', function () {
                return request(app)
                .get('/api/articles/NOTANID')
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns a 404 if the id is valid but not present', function () {
                return request(app)
                .get('/api/articles/eeeeeeeeeeeeeeeeeeeeeeee')
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                });
            });
        });
        describe('PUT', function () {
            it('increments a vote count if passed "up"', function () {
                const article = seedData.articles[0];
                const votesBefore = article.votes;
                return request(app)
                .put(`/api/articles/${article._id}`)
                .query({vote:'up'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('article');
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.include.keys(articleKeys);
                    expect(body.article.votes).to.equal(votesBefore + 1);
                });
            });
            it('increments a vote count if passed "down"', function () {
                const article = seedData.articles[0];
                const votesBefore = article.votes;
                return request(app)
                .put(`/api/articles/${article._id}`)
                .query({vote:'down'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('article');
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.include.keys(articleKeys);
                    expect(body.article.votes).to.equal(votesBefore - 1);
                });
            });
            it('leaves the vote count alone if not passed "up" or "down"', function () {
                const article = seedData.articles[0];
                const votesBefore = article.votes;
                return request(app)
                .put(`/api/articles/${article._id}`)
                .query({vote:'brap'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('article');
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.include.keys(articleKeys);
                    expect(body.article.votes).to.equal(votesBefore);
                });
            });
            it('returns 400 if the article id is invalid', function () {
                return request(app)
                .put('/api/articles/FAKE')
                .query({vote:'up'})
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns 404 if the article id is valid but not in the database', function () {
                return request(app)
                .put('/api/articles/eeeeeeeeeeeeeeeeeeeeeeee')
                .query({vote:'up'})
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                });
            });
            it('returns 400 if the vote query string is missing', function () {
                const article = seedData.articles[0];
                return request(app)
                .put(`/api/articles/${article._id}`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
        });
    });

    describe('/api/articles/:_id/comments', function () {
        describe('GET', function () {
            it('returns all comments for the selected article', function () {
                const article = seedData.articles[0]._id;
                const expectedComments = seedData.comments.filter(comment => comment.belongs_to === article._id);
                return request(app)
                .get(`/api/articles/${article}/comments`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('comments');

                    const comments = body.comments;
                    expect(comments).to.be.an('array');
                    expect(comments.length).to.equal(expectedComments.length);
                    expect(comments[0]).to.include.keys(commentKeys);
                    expect(comments[0].belongs_to).to.equal(`${article}`);
                });
            });
        });

        describe('POST', function () {
            const testComment = {comment: 'bro do you even lift?'};
            it('creates and returns a new comment', function () {
                const article = seedData.articles[0]._id;
                return request(app)
                .post(`/api/articles/${article}/comments`)
                .send(testComment)
                .expect(201)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('created');

                    const created = body.created;
                    expect(created).to.be.an('object');
                    expect(created).to.include.keys(commentKeys);
                });
            });
            it('returns 400 if the article id is invalid', function () {
                return request(app)
                .post('/api/articles/FAKED/comments')
                .send(testComment)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns 404 if the article id valid but not present', function () {
                return request(app)
                .post('/api/articles/eeeeeeeeeeeeeeeeeeeeeeee/comments')
                .send(testComment)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                });
            });
            it('returns 400 if the comment text is missing', function () {
                const article = seedData.articles[0]._id;
                return request(app)
                .post(`/api/articles/${article}/comments`)
                .expect(400);
            });
        });
    });

    describe('/api/comments/:_id', function () {
        describe('PUT', function () {
            it('increments a vote count if passed "up"', function () {
                const comment = seedData.comments[0];
                const votesBefore = comment.votes;
                return request(app)
                .put(`/api/comments/${comment._id}`)
                .query({vote:'up'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('comment');

                    const comment = body.comment;
                    expect(comment).to.be.an('object');
                    expect(comment).to.include.keys(commentKeys);
                    expect(comment.votes).to.equal(votesBefore + 1);
                });
            });
            it('increments a vote count if passed "down"', function () {
                const comment = seedData.comments[0];
                const votesBefore = comment.votes;
                return request(app)
                .put(`/api/comments/${comment._id}`)
                .query({vote:'down'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('comment');

                    const comment = body.comment;
                    expect(comment).to.be.an('object');
                    expect(comment).to.include.keys(commentKeys);
                    expect(comment.votes).to.equal(votesBefore - 1);
                });
            });
            it('leaves the vote count alone if not passed "up" or "down"', function () {
                const comment = seedData.comments[0];
                const votesBefore = comment.votes;
                return request(app)
                .put(`/api/comments/${comment._id}`)
                .query({vote:'brap'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('comment');

                    const comment = body.comment;
                    expect(comment).to.be.an('object');
                    expect(comment).to.include.keys(commentKeys);
                    expect(comment.votes).to.equal(votesBefore);
                });
            });
            it('returns 400 if the comment id is invalid', function () {
                return request(app)
                .put('/api/comments/FAKE')
                .query({vote:'up'})
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns 404 if the comment id is valid but not in the database', function () {
                return request(app)
                .put('/api/comments/eeeeeeeeeeeeeeeeeeeeeeee')
                .query({vote:'up'})
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                });
            });
            it('returns 400 if the vote query string is missing', function () {
                const comment = seedData.articles[0];
                return request(app)
                .put(`/api/articles/${comment._id}`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
        });
        describe('DELETE', function () {
            it('deletes the item', function () {
                const comment = `${seedData.comments[0]._id}`;
                return request(app)
                .delete(`/api/comments/${comment}`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('deleted');
                    expect(body.deleted).to.include.keys(commentKeys);
                    expect(body.deleted._id).to.equal(comment);
                    return request(app)
                    .get(`/api/comments/${comment}`)
                    .expect(404);
                });
            });
            it('returns a 400 if the id is invalid', function () {
                const comment = `${seedData.comments[0]._id}`;
                return request(app)
                .delete(`/api/comments/fakerfakefake`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(400);
                });
            });
            it('returns a 404 if the id is valid but does not exist', function () {
                return request(app)
                .delete('/api/comments/eeeeeeeeeeeeeeeeeeeeeeee')
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.include.keys('status', 'message');
                    expect(body.status).to.equal(404);
                });
            });
        });
    });

    describe('/api/users/:username', function () {
        it('returns the information for the specified user', function () {
            const {_id, username} = seedData.users[0];
            return request(app)
            .get(`/api/users/${username}`)
            .expect(200)
            .then(({body}) => {
                expect(body).to.be.an('object');
                expect(body).to.include.keys('user');

                const user = body.user;
                expect(user).to.be.an('object');
                expect(user).to.include.keys(userKeys);
                expect(user._id).to.equal(`${_id}`);
            });
        });
        it('returns a 404 if the username does not exist', function () {
            return request(app)
            .get('/api/users/mydyingbride')
            .expect(404);
        });
    });
});