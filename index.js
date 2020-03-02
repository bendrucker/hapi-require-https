'use strict'

const pkg = require('./package.json')

module.exports = { register, name: pkg.name }

function register (server, options) {
  server.ext('onRequest', function (request, h) {
    const redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.server.info.protocol === 'http'
    const host = request.headers['x-forwarded-host'] || request.headers.host

    if (!redirect) return h.continue
    return h
      .redirect('https://' + host + request.url.pathname + request.url.search)
      .takeover()
      .code(301)
  })
}
