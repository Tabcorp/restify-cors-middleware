var assert = require('assert-plus')
var preflight = require('./preflight')
var actual = require('./actual')
var constants = require('./constants.js')

/**
 * From http://www.w3.org/TR/cors/#resource-processing-model
 *
 * If "simple" request (paraphrased):
 *
 * 1. If the Origin header is not set, or if the value of Origin is not a
 *    case-sensitive match to any values listed in `opts.origins`, do not
 *    send any CORS headers
 *
 * 2. If the resource supports credentials add a single
 *    'Access-Control-Allow-Credentials' header with the value as "true", and
 *    ensure 'AC-Allow-Origin' is not '*', but is the request header value,
 *    otherwise add a single Access-Control-Allow-Origin header, with either the
 *    value of the Origin header or the string "*" as value
 *
 * 3. Add Access-Control-Expose-Headers as appropriate
 *
 * @public
 * @function createCorsContext
 * @param    {Object} options an options object
 * @param    {Array} [options.origins] an array of whitelisted origins, can be
 * both strings and regular expressions
 * @param    {Boolean} [options.credentials] if true, uses creds
 * @param    {Array} [options.allowHeaders] user defined headers to allow
 * @param    {Array} [options.exposeHeaders] user defined headers to expose
 * @param    {Number} [options.preflightMaxAge] seconds to cache preflight requests
 * @param    {Object | Function} [options.preflightStrategy]
 * customize preflight request handling
 * @returns  {Object} returns an object with actual and preflight handlers
 */
module.exports = function (options) {
  assert.object(options, 'options')
  assert.optionalArray(options.origins, 'options.origins')
  if (options.origins) {
    options.origins.forEach(function (o) {
      assert.ok(typeof o === 'string' || o instanceof RegExp, o +
                ' is not a valid origin')
    })
  }
  assert.optionalBool(options.credentials, 'options.credentials')
  assert.optionalArrayOfString(options.allowHeaders, 'options.allowHeaders')
  assert.optionalArrayOfString(options.exposeHeaders,
                                 'options.exposeHeaders')
  assert.optionalNumber(options.preflightMaxAge, 'options.preflightMaxAge')
  assert.optionalObject(options.preflightStrategy,
                          'options.preflightStrategy')

  var opts = options
  opts.origins = options.origins || ['*']
  opts.credentials = options.credentials || false
  opts.allowHeaders = options.allowHeaders || []
  opts.exposeHeaders = options.exposeHeaders || []

  assert.ok(options.origins.indexOf('*') === -1 ||
              options.credentials === false,
              'credentials not supported with wildcard')

  constants['EXPOSE_HEADERS'].forEach(function (h) {
    if (opts.exposeHeaders.indexOf(h) === -1) {
      opts.exposeHeaders.push(h)
    }
  })

  constants['ALLOW_HEADERS'].forEach(function (h) {
    if (opts.allowHeaders.indexOf(h) === -1) {
      opts.allowHeaders.push(h)
    }
  })

  return {
    actual: actual.handler(opts),
    preflight: preflight.handler(opts)
  }
}
