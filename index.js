'use strict'

const register = async function (server, options) {
  server.ext('onRequest', async function (request, h) {
    const redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.server.info.protocol === 'http'
    const host = request.headers['x-forwarded-host'] || request.headers.host
    if (redirect) {
      return h.redirect('https://' + host + request.url.path)
        .permanent()
        .takeover()
    }
    return h.continue
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('./package.json')
}
