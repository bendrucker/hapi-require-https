'use strict'

exports.register = function (server, options, next) {
  server.ext('onRequest', function (request, reply) {
    var redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.server.info.protocol === 'http'

    if (redirect) {
      return reply()
        .redirect('https://' + request.headers.host + request.url.path)
        .code(301)
    }
    reply.continue()
  })
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
