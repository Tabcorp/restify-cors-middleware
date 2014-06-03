var should = require('should');
var origin = require('../src/origin');

describe('Origin list', function() {

  it('returns false if the request has no origin', function() {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    origin.allowed(list, null).should.eql(false);
  });

  it('returns false if the origin is not in the list', function() {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    origin.allowed(list, 'http://random-website.com').should.eql(false);
  });

  it('returns true if the origin matched', function() {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    origin.allowed(list, 'http://api.myapp.com').should.eql(true);
  });

  it('does not do partial matches by default', function() {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    origin.allowed(list, 'api.myapp.com').should.eql(false);
  });

  it('supports * for partial matches', function() {
    var list = ['http://*.myapp.com', 'http://other-website.com']
    origin.allowed(list, 'http://api.myapp.com').should.eql(true);
  });

  it('escapes the partial regex properly', function() {
    var list = ['http://*.myapp.com', 'http://other-website.com']
    origin.allowed(list, 'http://xmyapp.com').should.eql(false);
  });

  it('returns false if there was no partial match', function() {
    var list = ['http://*.myapp.com']
    origin.allowed(list, 'http://random-website.com').should.eql(false);
  });

});
