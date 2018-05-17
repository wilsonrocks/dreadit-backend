process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const app = require('../index.js');
const request = require('supertest');

describe('NorthCoders News API', function () {
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

});