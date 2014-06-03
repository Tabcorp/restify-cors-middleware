
exports.allowed = function (list, requestOrigin) {
  function match (origin) {
    if (origin.indexOf('*') !== -1) {
      var regex = '^' + origin.replace('.', '\\.').replace('*', '.*') + '$'
      return requestOrigin.match(regex)
    } else {
      return requestOrigin === origin
    }
  }
  if (requestOrigin) {
    return list.some(match)
  } else {
    return false
  }
}
