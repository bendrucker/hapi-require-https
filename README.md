hapi-require-https [![Build Status](https://travis-ci.org/bendrucker/hapi-require-https.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-require-https) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/hapi-require-https.svg)](https://greenkeeper.io/)
==================

> hapi plugin that adds http to https redirection

By default, any incoming request with `'http'` in `X-Forwarded-Proto` will be redirected (301) to the same host and path with `'https'` as the protocol. You can optionally disable proxy mode and redirect based on the actual request protocol.

## Usage

Just [register the plugin](https://github.com/hapijs/hapi/blob/master/API.md#server.register()) and go!

```js
server.register({
  plugin: require('hapi-require-https'),
  options: {}
})
```

## API

#### `plugin.register(server, [options])`

Registers the plugin to run `onRequest` in the [request lifecycle](http://hapijs.com/api#request-lifecycle). 

##### options

Type: `object`  
Default: `{}`

###### proxy

Type: `boolean`  
Default: `true`

Indicates whether the server expects requests coming from a reverse proxy (a common Node web server setup) or directly from the Internet. Set this to `false` if you'd like to redirect based on the *actual* protocol instead of the [`X-Forwarded-Proto`](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Common_non-standard_response_fields) header.

## License

MIT © [Ben Drucker](http://bendrucker.me)
