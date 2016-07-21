'use strict'

var internals = {}

internals.defaults = {
  enabled: true,
  proxied: true,
  shouldRedirect: function (config, request) {
    if (config.proxied) {
      return request.headers['x-forwarded-proto'] === 'http'
    }

    return request.server.info.protocol === 'http'
  }
}

exports.register = function (server, options, next) {
  var config = Object.assign({}, internals.defaults, options)

  // don't register unless needed
  if (config.enabled) {
    server.ext('onRequest', function (request, reply) {
      if (config.shouldRedirect(config, request)) {
        return reply()
          .redirect('https://' + request.headers.host + request.url.path)
          .code(301)
      }
      reply.continue()
    })
  }

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
