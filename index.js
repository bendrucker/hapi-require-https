'use strict'

var pkg = require('./package.json')

module.exports = { register, name: pkg.name }

function register (server, options) {
  server.ext('onRequest', function (request, h) {
    var redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.server.info.protocol === 'http'
    var host = request.headers['x-forwarded-host'] || request.headers.host

    if (!redirect) return h.continue
    return h
      .redirect('https://' + host + (request.url.path || request.url.pathname + request.url.search))
      .takeover()
      .code(301)
  })
}
