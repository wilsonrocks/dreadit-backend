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