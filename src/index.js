var restify = require('restify');
var util    = require('util');

DEFAULT_ALLOW_HEADERS = restify.CORS.ALLOW_HEADERS;

var HTTP_NO_CONTENT = 204;

function matchOrigin(req, origins) {
  var origin = req.headers["origin"];
  function belongs(o) {
    if (origin === o || o === "*") {
      origin = o;
      return true;
    }
    return false;
  }
  if (origin && origins.some(belongs)) {
    return origin;
  } else {
    return false;
  }
}

function preflightHandler(options) {
  return function(req, res, next) {
    if (req.method !== 'OPTIONS') return next();

    // 6.2.1 and 6.2.2
    if (matchOrigin(req, options.origins) === false) return next();

    // 6.2.3
    requestedMethod = req.headers['access-control-request-method'];
    if (!requestedMethod) return next();

    // 6.2.4
    requestedHeaders = req.headers['access-control-request-headers'];
    requestedHeaders = requestedHeaders ? requestedHeaders.split(', ') : [];

    allowedMethods = [requestedMethod, 'OPTIONS'];
    allowedHeaders = DEFAULT_ALLOW_HEADERS.concat(['x-requested-with'])
                                          .concat(options.allowHeaders);

    // 6.2.7
    res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Credentials', true);

    // 6.2.9
    res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));

    // 6.2.10
    res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    res.send(HTTP_NO_CONTENT);
  };
}

module.exports = function(options) {

  if (! util.isArray(options.origins))       options.origins = ['*'];
  if (! util.isArray(options.allowHeaders))  options.allowHeaders = [];
  if (! util.isArray(options.exposeHeaders)) options.exposeHeaders = [];

  return {

    actual: restify.CORS({
      origins: options.origins,
      headers: options.exposeHeaders
    }),

    preflight: preflightHandler({
      origins: options.origins,
      allowHeaders: options.allowHeaders
    })

  };

};
