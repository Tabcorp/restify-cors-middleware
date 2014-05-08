var util       = require('util');
var preflight  = require('./preflight');
var actual     = require('./actual');

module.exports = function(options) {

  if (! util.isArray(options.origins))       options.origins = ['*'];
  if (! util.isArray(options.allowHeaders))  options.allowHeaders = [];
  if (! util.isArray(options.exposeHeaders)) options.exposeHeaders = [];

  return {
    actual: actual.handler(options),
    preflight: preflight.handler(options)
  };

};
