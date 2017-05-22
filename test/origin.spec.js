var should = require('should');
var origin = require('../src/origin');

describe('Origin list', function() {

  var list = [
    'http://api.myapp.com',
    'http://www.myapp.com'
  ];

  it('returns null if the origin is not in the list', function() {
    var o = origin.match('http://random-website.com', list);
    (o === null).should.eql(true);
  });

  it('does not do partial matches', function() {
    var o = origin.match('api.myapp.com', list);
    (o === null).should.eql(true);
  });

  it('returns the origin if it matched', function() {
    var o = origin.match('http://api.myapp.com', list);
    o.should.eql('http://api.myapp.com');
  });

  it('returns the origin if the list contains *', function() {
    var o = origin.match('http://random-website.com', ['*']);
    o.should.eql('http://random-website.com');
  });

});
