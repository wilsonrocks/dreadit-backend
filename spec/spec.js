process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../index.js');

describe('NorthCoders News API', function () {
    before(function () {
        mongoose.connect('mongodb://localhost/northcoders_news_test');
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
    require('./topics.spec');
    require('./articles.spec');
    require('./comments.spec');
    require('./users.spec');

});