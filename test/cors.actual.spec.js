//
// Based on the spec at http://www.w3.org/TR/cors/
// The test numbers correspond do steps in the specification
//

var request  = require('supertest');
var should   = require('should');
var test     = require('./test');

describe('CORS: simple / actual requests', function() {

    it('6.1.1 Does not set headers if Origin is missing', function(done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      });
      request(server)
        .get('/test')
        .expect(test.noHeader('access-control-allow-origin'))
        .expect(200)
        .end(done);
    });

    it('6.1.2 Does not set headers if Origin does not match', function(done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      });
      request(server)
        .get('/test')
        .set('Origin', 'http://random-website.com')
        .expect(test.noHeader('access-control-allow-origin'))
        .expect(200)
        .end(done);
    });

   it('6.1.3 Sets Allow-Origin headers if the Origin matches', function(done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      });
      request(server)
        .get('/test')
        .set('Origin', 'http://api.myapp.com')
        .expect('access-control-allow-origin', 'http://api.myapp.com')
        .expect(200)
        .end(done);
   });

   it('6.1.4 Does not set exposed headers if empty', function(done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com']
      });
      request(server)
        .get('/test')
        .set('Origin', 'http://api.myapp.com')
        .expect('access-control-allow-origin', 'http://api.myapp.com')
        .expect('access-control-expose-headers', /api-version/)     // defaults
        .expect(200)
        .end(done);
    });

   it('6.1.4 Sets exposed headers if configured', function(done) {
      var server = test.corsServer({
        origins: ['http://api.myapp.com', 'http://www.myapp.com'],
        exposeHeaders: ['HeaderA', 'HeaderB']
      });
      request(server)
        .get('/test')
        .set('Origin', 'http://api.myapp.com')
        .expect('access-control-allow-origin', 'http://api.myapp.com')
        .expect('access-control-expose-headers', /HeaderA, HeaderB/)  // custom
        .expect('access-control-expose-headers', /api-version/)       // defaults
        .expect(200)
        .end(done);
    });

});
