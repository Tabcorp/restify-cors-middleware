exports.match = function (incomingOrigin, origins) {
  if (!incomingOrigin) {
    return null
  }

  for (var i = 0; i < origins.length; i++) {
    var origin = origins[i]
    if ((origin instanceof RegExp && origin.test(incomingOrigin)) ||
            (typeof origin === 'string' && origin === incomingOrigin) ||
            (origin === '*')) {
      return incomingOrigin
    }
  }

  return null
}
