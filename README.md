# restify-cors-middleware

> CORS middleware with full [W3C spec](www.w3.org/TR/cors) support.

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
