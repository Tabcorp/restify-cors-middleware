# restify-cors-middleware

> CORS middleware with full [W3C spec](www.w3.org/TR/cors) support.

[![NPM](http://img.shields.io/npm/v/restify-cors-middleware.svg?style=flat)](https://npmjs.org/package/restify-cors-middleware)
[![License](http://img.shields.io/npm/l/restify-cors-middleware.svg?style=flat)](https://github.com/TabDigital/restify-cors-middleware)

[![Build Status](http://img.shields.io/travis/TabDigital/restify-cors-middleware.svg?style=flat)](http://travis-ci.org/TabDigital/restify-cors-middleware)
[![Dependencies](http://img.shields.io/david/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Dev dependencies](http://img.shields.io/david/dev/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Peer dependencies](http://img.shields.io/david/peer/TabDigital/restify-cors-middleware.svg?style=flat)](https://david-dm.org/TabDigital/restify-cors-middleware)
[![Known Vulnerabilities](https://snyk.io/package/npm/restify-cors-middleware/badge.svg)](https://snyk.io/package/npm/restify-cors-middleware)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Usage

```js
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['http://api.myapp.com', 'http://web.myapp.com'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight)
server.use(cors.actual)
```

## Allowed origins

You can specify the full list of domains and subdomains allowed in your application.
As a convenience method, you can use the `*` character as a wildcard.

```js
origins: [
  'http://myapp.com',
  'http://*.myotherapp.com'
]
```

The `Access-Control-Allow-Origin` header will be set to the actual origin that matched, on a per-request basis. The person making the request will not know about the full configuration, like other allowed domains or any wildcards in use.

The main side-effect is that every response will include `Vary: Origin`, since the response headers depend on the origin. This is the safest setup, but will decrease your cache hit-rate / increase your cache size with every origin.

## Open CORS setup

Using `origins: ['*']` is also a valid setup, which comes with obvious security implications. This means **any** domain will be able to query your API. However it does have performance benefits. When using `['*']`, the middleware always responds with `Access-Control-Allow-Origin: *` which means responses can be cached regardless of origins.

Each API should weigh the security and performance angles before choosing this approach.

## Compliance to the spec

See [unit tests](https://github.com/TabDigital/restify-cors-middleware/tree/master/test) for examples of preflight and actual requests.
