var originMatcher = require('./origin-matcher')
var constants = require('./constants.js')

exports.handler = function (options) {
  var matcher = originMatcher.create(options.origins)

  if (originMatcher.generic(options.origins)) {
    //
    // If origins = ['*'] then we always set generic CORS headers
    // This is the simplest case, similar to what restify.fullResponse() used to do
    // Must must keep the headers generic because they can be cached by reverse proxies
    //

    return function (req, res, next) {
      if (req.method !== 'OPTIONS') return next()
      res.once('header', function () {
        res.header(constants['AC_ALLOW_ORIGIN'], '*')
        res.header(constants['AC_ALLOW_CREDS'], false) // not compatible with *
        res.header(constants['AC_ALLOW_METHODS'], 'GET, PUT, POST, DELETE, OPTIONS')
        res.header(constants['AC_ALLOW_HEADERS'], options.allowHeaders.join(', '))
      })
      res.send(constants['HTTP_NO_CONTENT'])
    }
  } else {
    //
    // Full CORS mode
    // This is the "better" option where we have a list of origins
    // In this case, we return customised CORS headers for each request
    // And must set the "Vary: Origin" header
    //

    return function (req, res, next) {
      if (req.method !== 'OPTIONS') return next()

      // 6.2.1 and 6.2.2
      var originHeader = req.headers['origin']
      if (!matcher(originHeader)) return next()

      // 6.2.3
      var requestedMethod = req.headers[constants['AC_REQ_METHOD']]
      if (!requestedMethod) return next()

      // 6.2.4
      // var requestedHeaders = req.headers[constants['AC_REQ_HEADERS']]
      // requestedHeaders = requestedHeaders ? requestedHeaders.split(', ') : []
      var allowedMethods = [requestedMethod, 'OPTIONS']
      var allowedHeaders = constants['ALLOW_HEADERS'].concat(options.allowHeaders)

      res.once('header', function () {
        // 6.2.7
        res.header(constants['AC_ALLOW_ORIGIN'], originHeader)
        res.header(constants['AC_ALLOW_CREDS'], true)

        // 6.2.8
        if (options.preflightMaxAge) {
          res.header(constants['AC_MAX_AGE'], options.preflightMaxAge)
        }

        // 6.2.9
        res.header(constants['AC_ALLOW_METHODS'], allowedMethods.join(', '))

        // 6.2.10
        res.header(constants['AC_ALLOW_HEADERS'], allowedHeaders.join(', '))

        // 6.4
        res.header('Vary', 'Origin')
      })

      res.send(constants['HTTP_NO_CONTENT'])
    }
  }
}
