var util       = require('util');
var restify    = require('restify');
var preflight  = require('./preflight');

module.exports = function(options) {

  if (! util.isArray(options.origins))       options.origins = ['*'];
  if (! util.isArray(options.allowHeaders))  options.allowHeaders = [];
  if (! util.isArray(options.exposeHeaders)) options.exposeHeaders = [];

  return {

    actual: restify.CORS({
      origins: options.origins,
      headers: options.exposeHeaders
    }),

    preflight: preflight.handler({
      origins: options.origins,
      allowHeaders: options.allowHeaders
    })

  };

};
