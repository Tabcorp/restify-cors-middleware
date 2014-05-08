var restify = require('restify');

//
// For now, delegate to restify.CORS
//
// Although there's a few things we could fix
// around Access-Control-Expose-Headers
//
// It would also break the cyclic dependency with Restify :)
//

exports.handler = function(options) {

  return restify.CORS({
    origins: options.origins,
    headers: options.exposeHeaders
  });

};
