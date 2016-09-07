# restify-cors-middleware

> CORS middleware with full [W3C spec](www.w3.org/TR/cors) support.

[![NPM](http://img.shields.io/npm/v/restify-cors-middleware.svg?style=flat)](https://npmjs.org/package/restify-cors-middleware)
[![License](http://img.shields.io/npm/l/restify-cors-middleware.svg?style=flat)](https://github.com/TabDigital/restify-cors-middleware)

[![Build Status](http://img.shields.io/travis/TabDigital/restify-cors-middleware.svg?style=flat)](http://travis-ci.org/TabDigital/restify-cors-middleware)
[![Dependencies](http://img.shields.io/david/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Dev dependencies](http://img.shields.io/david/dev/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Peer dependencies](http://img.shields.io/david/peer/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Known Vulnerabilities](https://snyk.io/package/npm/restify-cors-middleware/badge.svg)](https://snyk.io/package/npm/restify-cors-middleware)

## Usage

```js
var corsMiddleware = require('restify-cors-middleware');

var cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://api.myapp.com', 'http://web.myapp.com'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);
```

## Compliance to the spec

See [unit tests](https://github.com/TabDigital/restify-cors-middleware/tree/master/test)
for examples of preflight and actual requests.
