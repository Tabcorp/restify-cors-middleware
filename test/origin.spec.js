/* eslint-env mocha */
require('should')
var originMatcher = require('../src/origin-matcher')

describe('Origin list', function () {
  it('returns false if the request has no origin', function () {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    var matcher = originMatcher.create(list)
    matcher(null).should.eql(false)
    matcher('').should.eql(false)
  })

  it('returns false if the origin is not in the list', function () {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    var matcher = originMatcher.create(list)
    matcher('http://random-website.com').should.eql(false)
  })

  it('returns true if the origin matched', function () {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    var matcher = originMatcher.create(list)
    matcher('http://api.myapp.com').should.eql(true)
  })

  it('does not do partial matches by default', function () {
    var list = ['http://api.myapp.com', 'http://www.myapp.com']
    var matcher = originMatcher.create(list)
    matcher('api.myapp.com').should.eql(false)
  })

  it('always matches if the list contains *', function () {
    var list = ['*']
    var matcher = originMatcher.create(list)
    matcher('http://random-website.com').should.eql(true)
  })

  it('supports * for partial matches', function () {
    var list = ['http://*.myapp.com', 'http://other-website.com']
    var matcher = originMatcher.create(list)
    matcher('http://api.myapp.com').should.eql(true)
  })

  it('escapes the partial regex properly', function () {
    // the "." should be a real dot, not mean "[any character]myapp"
    var list = ['http://*.myapp.com', 'http://other-website.com']
    var matcher = originMatcher.create(list)
    matcher('http://xmyapp.com').should.eql(false)
  })

  it('returns false if there was no partial match', function () {
    var list = ['http://*.myapp.com']
    var matcher = originMatcher.create(list)
    matcher('http://random-website.com').should.eql(false)
  })

  it('supports regular expressions', function () {
    var list = ['http://api.myapp.com', /https?:\/\/example.com(:8888)?/]
    var matcher = originMatcher.create(list)
    matcher('https://example.com:8888').should.eql(true)
  })
})
