hapi-require-https [![Build Status](https://travis-ci.org/bendrucker/hapi-require-https.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-require-https)
==================

http to https redirection for Hapi servers behind a reverse proxy. Any incoming request with `'http'` in `X-Forwarded-Proto` will be redirected (301) to the same host and path with `'https'` as the protocol. 

## How to use it ?

To use this plugin you need to register it after you have created your server.

```javascript

//other imports
const redirect = require('hapi-require-https');

//create your server

//register the plugin to redirect all http trafic to https
server.register(redirect, function (error) {
  console.log(error);
})

```
