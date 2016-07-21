hapi-require-https [![Build Status](https://travis-ci.org/bendrucker/hapi-require-https.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-require-https)
==================

http to https redirection for Hapi servers.

For servers behind a reverse proxy or any load balancer setting the `X-Forwarded-Proto` header, such as AWS ELB. Any incoming request with `'http'` in `X-Forwarded-Proto` will be redirected (301) to the same host and path with `'https'` as the protocol.

This plugin can also be used with a normal http connection by setting `proxied: false` in the options. Any request with an `'http'` protocol will be redirected (301) to the same host and path with `'https'` as the protocol. This could be handy if you are trying to save money by not running behind an ELB on AWS for certain environments.

A more efficient option is outlined [here](https://github.com/hapijs/hapi/issues/778#issuecomment-16604734) if the server will never have proxy enabled.

## Installation

```bash
npm install --save hapi-require-https
```

## Usage

Just [load the plugin](http://hapijs.com/tutorials/plugins#loading-a-plugin) and go!

```js
server.register(redirect, function (err) {
  console.error(err)
})
```

Optionally, register with custom options. Helpful when used with [Confidence](https://github.com/hapijs/confidence) for different environments or if the connection should always be checked.

```js
server.register({
    register: 'hapi-require-https',
    options: {
      // custom options
    }
  }, function (err) {
    console.error(err)
  })
```

### Options

- `options` - plugin options object where:
  - `enabled` - a boolean specifying whether to enable. Defaults to `true`
  - `proxied` - a boolean specifying whether server is behind a reverse proxy.  Defaults to `true`
  - `shouldRedirect` - a function used to determine whether to redirect. In the crazy event you'd like to override the default functionality.