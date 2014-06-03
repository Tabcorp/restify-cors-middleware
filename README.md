# restify-cors-middleware

> CORS middleware with full [W3C spec](www.w3.org/TR/cors) support.

## Usage

```js
var corsMiddleware = require('restify-cors-middleware');

var cors = corsMiddleware({
  origins: ['http://api.myapp.com', 'http://web.myapp.com'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);
```

## Allowed origins

As a convenience method, you can use the `*` character as a wildcard. This means you can allow any origins:

```js
origins: ['*']
```

Or you can also allow selected subdomains of your application:

```js
origins: [
  'http://myapp.com',
  'http://*.myapp.com'
]
```

For added security, this middleware sets `Access-Control-Allow-Origin` to the origin that matched, not the configured wildcard.

## Troubleshooting

As per the spec, requests without an `Origin` will not receive any headers. Requests with a matching `Origin` will receive the appropriate response headers. Always be careful that any reverse proxies (e.g. Varnish) very their cache depending on the origin, so you don't serve CORS headers to the wrong request.

## Compliance to the spec

See [unit tests](https://github.com/TabDigital/restify-cors-middleware/tree/master/test) for examples of preflight and actual requests.
