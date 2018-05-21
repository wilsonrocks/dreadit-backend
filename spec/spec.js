process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');
const seed = require('../seed/seed');
const app = require('../index.js');

let seedData = 'intialized';

const articleKeys = ['_id', 'title', 'body', 'belongs_to', 'votes', 'created_by'];
const commentKeys = ['created_at', '_id', 'body', 'belongs_to', 'created_by', 'votes'];



describe('NorthCoders News API', function () {

    before(function () {
        mongoose.connect('mongodb://localhost/northcoders_news_test');
    });
    beforeEach(function () {
        return mongoose.connection.dropDatabase()
        .then(() => {
            return seed('test');
        })
        .then(data => {
            seedData = data;
        });

    });
    after(function () {
        mongoose.disconnect();
    });

    describe('/api', function () {

        it('GET returns an HTML page with the documented endpoints', function () {
            return request(app)
                .get('/api')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('text/html');
                });
        });
    })

    describe('/api/topics', function () {
        describe('GET', function () {
            it('Returns all the topics', function () {
                const seedTopics = seedData.topics;
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('topics');
                    expect(res.body.topics).to.be.an('array');
                    expect(res.body.topics.length).to.equal(seedTopics.length);
                    expect(res.body.topics[0]).to.be.an('object');
                    expect(res.body.topics[0]).to.have.keys('_id', 'title', 'slug');
                });l
            });
        });
    });

    describe('/api/topics/:_id/articles', function () {
        describe('GET', function () {
            it('returns all the articles when the id is valid and present', function () {
                const testTopic = seedData.topics[0];
                const id = testTopic._id;
                const expectedArticles = seedData.articles.filter(x => x.belongs_to === id);
                return request(app)
                .get(`/api/topics/${id}/articles`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('articles');
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.length).to.equal(expectedArticles.length);
                    const returnedArticle = res.body.articles[0];
                    expect(returnedArticle).to.have.keys(articleKeys);
                    expect(returnedArticle.belongs_to).to.equal(`${testTopic._id}`);
                });
            });
            it('Returns a 400 if id is not valid', function () {
                return request(app)
                .get('/api/topics/eeeee/articles')
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(400);
                });
            });
            it('Returns a 400 if id is valid but the topic is not in the database', function () {
                return request(app)
                .get('/api/topics/eeeeeeeeeeeeeeeeeeeeeeee/articles')
                .expect(404)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
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
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('created');
                    const created = res.body.created;
                    expect(created).to.be.an('object');
                    expect(created).to.have.keys(articleKeys);
                    expect(created.votes).to.equal(0);
                    expect(created.belongs_to).to.equal(`${topic}`);
                });
            });
            it('returns a 400 if the topic is not valid', function () {
                return request(app)
                .post('/api/topics/FAKER/articles')
                .send(testArticle)
                .expect(400)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(400);
                });
            });
            it('returns a 404 if the topic is valid but not there', function () {
                return request(app)
                .post('/api/topics/eeeeeeeeeeeeeeeeeeeeeeee/articles')
                .send(testArticle)
                .expect(404)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(404);
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
            // return 400 if bad JSON
        });
    });

    describe('/api/articles', function () {
        describe('GET', function () {
            it('fetches all the articles', function () {
                return request(app)
                .get('/api/articles')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('articles');
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles).to.have.length(4);
                    expect(res.body.articles[0]).to.have.keys('_id', 'votes', 'title', 'created_by', 'body', 'belongs_to');
                });
            });
        });
    });

    describe('/api/articles/:_id', function () {
        describe('GET', function () {
            it('fetches the specific article', function () {
                return request(app)
                .get('/api/articles')
                .then(res => res.body.articles[0]._id)
                .then(id => request(app).get(`/api/articles/${id}`))
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('article');
                    expect(res.body.article).to.be.an('object');
                    expect(res.body.article).to.have.keys('_id', 'votes', 'title', 'created_by', 'body', 'belongs_to');
                });
            });
            it('returns a 400 if the id is invalid', function () {
                return request(app)
                .get('/api/articles/NOTANID')
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(400);
                });
            });
            it('returns a 404 if the id is valid but not present', function () {
                return request(app)
                .get('/api/articles/eeeeeeeeeeeeeeeeeeeeeeee')
                .then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(404);
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
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('comments');
                    expect(res.body.comments).to.be.an('array');
                    expect(res.body.comments.length).to.equal(expectedComments.length);
                    expect(res.body.comments[0]).to.have.keys(commentKeys);
                    expect(res.body.comments[0].belongs_to).to.equal(`${article}`);
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
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('created');
                    const created = res.body.created;
                    expect(created).to.be.an('object');
                    expect(created).to.have.keys(commentKeys);
                });
            });
            it('returns 400 if the article id is invalid', function () {
                return request(app)
                .post('/api/articles/FAKED/comments')
                .send(testComment)
                .expect(400)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(400);
                });
            });
            it('returns 404 if the article id valid but not present', function () {
                return request(app)
                .post('/api/articles/eeeeeeeeeeeeeeeeeeeeeeee/comments')
                .send(testComment)
                .expect(404)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('status', 'message');
                    expect(res.body.status).to.equal(404);
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
});