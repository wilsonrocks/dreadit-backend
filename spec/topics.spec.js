const expect = require('chai').expect;
const request = require('supertest');

const app = require('../index');

describe('/api/topics', function () {
    describe('GET', function () {
        it('Returns all the topics', function () {
            return request(app)
            .get('/api/topics')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('topics');
                expect(res.body.topics).to.be.an('array');
                expect(res.body.topics.length).to.equal(2);
                expect(res.body.topics[0]).to.be.an('object');
                expect(res.body.topics[0]).to.have.keys('_id', 'title', 'slug');
             });
        });
    });
});

describe('/api/topics/:id/articles', function () {
    describe('GET', function () {
        it('returns all the articles when the id is valid and present', function () {
            return request(app)
            .get('/api/topics')
            .then(res => {
                return res.body.topics.filter(x => x.slug === 'mitch')[0]._id;
            })
            .then(id => {
                return request(app)
                .get(`/api/topics/${id}/articles`);
            })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('articles');
                expect(res.body.articles).to.be.an('array');
                expect(res.body.articles).to.have.length(2);
                expect(res.body.articles[0]).to.be.an('object');
                expect(res.body.articles[0]).to.have.keys('_id', 'votes', 'title', 'created_by', 'body', 'belongs_to');
            })
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
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('status', 'message');
                expect(res.body.status).to.equal(400);
            });
        });

    });
});