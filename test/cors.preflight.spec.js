//
// Based on the spec at http://www.w3.org/TR/cors/
// The test numbers correspond to steps in the specification
//
/* eslint-env mocha */

var request = require('supertest')
var test = require('./test')

var METHOD_NOT_ALLOWED = 405

describe('CORS: preflight requests', function () {
  describe('Generic', function () {
    // In this configuration, we want to always reply with "*"
    // Responses can be cached by reverse proxies, so they must all look the same

    var server = test.corsServer({
      origins: ['*'],
      allowHeaders: ['MyHeader']
    })

    it('6.1 Always replies with generic CORS headers', function (done) {
      request(server)
        .options('/test')
        .set('Origin', 'http://api.myapp.com')
        .expect('access-control-allow-origin', '*')
        .expect('access-control-allow-methods', 'GET, PUT, POST, DELETE, OPTIONS')
        .expect('Access-Control-Allow-Headers', /x-requested-with/)
        .expect('Access-Control-Allow-Headers', /MyHeader/)
        .expect(204)
        .end(done)
    })

    it('6.1 Includes CORS headers even if the request has no Origin', function (done) {
      request(server)
        .options('/test')
        .expect('access-control-allow-origin', '*')
        .expect('access-control-allow-methods', 'GET, PUT, POST, DELETE, OPTIONS')
        .expect('Access-Control-Allow-Headers', /x-requested-with/)
        .expect('Access-Control-Allow-Headers', /MyHeader/)
        .expect(204)
        .end(done)
    })

    it('6.4 Does not need the Vary header since all responses are the same', function (done) {
      request(server)
        .options('/test')
        .set('Origin', 'http://api.myapp.com')
        .expect(test.noHeader('vary'))
        .expect(204)
        .end(done)
    })
  })

  describe('Full CORS mode', function () {
    it('6.2.1 Does not set headers if Origin is missing', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .expect(test.noHeader('access-control-allow-origin'))
          .expect(METHOD_NOT_ALLOWED)
          .end(done)
    })

    it('6.2.2 Does not set headers if Origin does not match', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://random-website.com')
          .expect(test.noHeader('access-control-allow-origin'))
          .expect(METHOD_NOT_ALLOWED)
          .end(done)
    })

    it('6.2.3 Does not set headers if Access-Control-Request-Method is missing', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .expect(test.noHeader('access-control-allow-origin'))
          .expect(test.noHeader('access-control-allow-methods'))
          .expect(METHOD_NOT_ALLOWED)
          .end(done)
    })

    xit('6.2.4 Does not terminate if parsing of Access-Control-Request-Headers fails', function (done) {
      done()
    })

    xit('6.2.5 Always matches Access-Control-Request-Method (spec says it is acceptable)', function (done) {
      done()
    })

    it('6.2.6 Does not set headers if Access-Control-Request-Headers does not match', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com'],
        acceptHeaders: ['API-Token']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .set('Access-Control-Request-Headers', 'Weird-Header')
          .expect(test.noHeader('access-control-allow-origin'))
          .expect(test.noHeader('access-control-allow-methods'))
          .expect(test.noHeader('access-control-allow-headers'))
          .expect(METHOD_NOT_ALLOWED)
          .end(done)
    })

    it('6.2.7 Set the Allow-Origin header if it matches', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .set('Access-Control-Request-Method', 'GET')
          .expect('Access-Control-Allow-Origin', 'http://api.myapp.com')
          .expect(204)
          .end(done)
    })

    it('6.2.8 Set the Access-Control-Max-Age header if a max age is provided', function (done) {
      var server = test.corsServer({
        preflightMaxAge: 5,
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .set('Access-Control-Request-Method', 'GET')
          .expect('Access-Control-Max-Age', '5')
          .expect(204)
          .end(done)
    })

    it('6.2.9 Set the Allow-Method header', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .set('Access-Control-Request-Method', 'GET')
          .expect('Access-Control-Allow-Methods', 'GET, OPTIONS')
          .expect(204)
          .end(done)
    })

    it('6.2.10 Set the Allow-Headers to all configured custom headers', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com'],
        allowHeaders: ['HeaderA']
      })
      request(server)
          .options('/test')
          .set('Origin', 'http://api.myapp.com')
          .set('Access-Control-Request-Method', 'GET')
          .expect('Access-Control-Allow-Headers', /accept-version/)  // restify defaults
          .expect('Access-Control-Allow-Headers', /x-api-version/)   // restify defaults
          .expect('Access-Control-Allow-Headers', /HeaderA/)         // custom header
          .expect(204)
          .end(done)
    })

    it('6.4 Sets the Vary header if it returns the actual origin', function (done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com']
      })
      request(server)
        .options('/test')
        .set('Origin', 'http://api.myapp.com')
        .set('Access-Control-Request-Method', 'GET')
        .expect('vary', 'Origin')
        .expect(204)
        .end(done)
    })
  })
})
