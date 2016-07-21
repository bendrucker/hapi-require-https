hapi-require-https [![Build Status](https://travis-ci.org/bendrucker/hapi-require-https.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-require-https)
==================

> hapi plugin that adds http to https redirection for servers behind a reverse proxy

Any incoming request with `'http'` in `X-Forwarded-Proto` will be redirected (301) to the same host and path with `'https'` as the protocol. 

## Usage

Just [load the plugin](http://hapijs.com/tutorials/plugins#loading-a-plugin) and go!

```js
server.register(redirect, function (err) {
  console.error(err)
})
```
