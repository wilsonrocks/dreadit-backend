process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');
const seed = require('../seed/seed');

const app = require('../index.js');
let seedData = 'intialized';

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
                    expect(returnedArticle).to.have.keys('_id', 'title', 'body', 'belongs_to', 'votes', 'created_by');
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

    describe('/api/articles/id', function () {
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
                });
            });
        });
    });
});