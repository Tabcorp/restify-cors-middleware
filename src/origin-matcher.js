
exports.create = function (allowedOrigins) {
  // pre-compile list of matchers, so regexes are only built once
  var matchers = allowedOrigins.map(createMatcher)
  // does a given request Origin match the list?
  return function (requestOrigin) {
    if (requestOrigin) {
      return matchers.some(matcher => matcher(requestOrigin))
    } else {
      return false
    }
  }
}

function createMatcher (allowedOrigin) {
  if (allowedOrigin instanceof RegExp) {
    return requestOrigin => requestOrigin.match(allowedOrigin)
  } else if (allowedOrigin.indexOf('*') === -1) {
    // simple string comparison
    return requestOrigin => requestOrigin === allowedOrigin
  } else {
    // need to build a regex
    var regex = '^' + allowedOrigin.replace('.', '\\.').replace('*', '.*') + '$'
    return requestOrigin => requestOrigin.match(regex)
  }
}
