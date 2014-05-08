var restify   = require('restify');
var origin    = require('./origin');

var DEFAULT_ALLOW_HEADERS = restify.CORS.ALLOW_HEADERS;
var HTTP_NO_CONTENT = 204;

exports.handler = function(options) {

  return function(req, res, next) {
    if (req.method !== 'OPTIONS') return next();

    // 6.2.1 and 6.2.2
    originHeader = req.headers['origin'];
    if (origin.match(originHeader, options.origins) === false) return next();

    // 6.2.3
    requestedMethod = req.headers['access-control-request-method'];
    if (!requestedMethod) return next();

    // 6.2.4
    requestedHeaders = req.headers['access-control-request-headers'];
    requestedHeaders = requestedHeaders ? requestedHeaders.split(', ') : [];

    allowedMethods = [requestedMethod, 'OPTIONS'];
    allowedHeaders = DEFAULT_ALLOW_HEADERS.concat(['x-requested-with'])
                                          .concat(options.allowHeaders);

    res.once('header', function() {

      // 6.2.7
      res.header('Access-Control-Allow-Origin', originHeader);
      res.header('Access-Control-Allow-Credentials', true);

      // 6.2.9
      res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));

      // 6.2.10
      res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));

    });

    res.send(HTTP_NO_CONTENT);
  };

};

