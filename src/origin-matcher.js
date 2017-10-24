
exports.create = function (allowedOrigins) {
  // pre-compile list of matchers, so regexes are only built once
  var matchers = allowedOrigins.map(createMatcher)
  // does a given request Origin match the list?
  return function (requestOrigin) {
    if (requestOrigin) {
      return matchers.some(function (matcher) {
        return matcher(requestOrigin)
      })
    }

    return false
  }
}

function createMatcher (allowedOrigin) {
  if (allowedOrigin.indexOf('*') === -1) {
    // simple string comparison
    return function (requestOrigin) {
      return requestOrigin === allowedOrigin
    }
  }

  // need to build a regex
  var regex = '^' + allowedOrigin.replace('.', '\\.').replace('*', '.*') + '$'

  return function (requestOrigin) {
    return requestOrigin.match(regex)
  }
}
