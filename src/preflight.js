var originMatcher = require('./origin-matcher')
var constants = require('./constants.js')

exports.handler = function (options) {
  var matcher = originMatcher.create(options.origins)
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
    var allowedHeaders = options.allowHeaders

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
    })

    res.send(constants['HTTP_NO_CONTENT'])
  }
}
