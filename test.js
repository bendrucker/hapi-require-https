'use strict'

var Code = require('code')
var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect

var hapi = require('hapi')

describe('hapi-require-https', function () {
  function createServer (options) {
    var config = options || {}

    var server = new hapi.Server()

    server.connection()

    server.register({ register: require('./'), options: config }, function (err) {
      if (err) throw err
    })

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply('Hello!')
      }
    })

    return server
  }

  function destroy (server) {
    server.stop()
  }

  it('redirects requests where x-forwarded-proto is http', function (done) {
    var server = createServer()

    server.inject({
      url: '/',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'http'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(301)
      expect(response.headers.location).to.equal('https://host/')

      destroy(server)
      done()
    })
  })

  it('redirects requests where protocol is http and proxy is false', function (done) {
    var server = createServer({ proxied: false })

    server.inject({
      url: '/',
      headers: {
        host: 'host'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(301)
      expect(response.headers.location).to.equal('https://host/')

      destroy(server)
      done()
    })
  })

  it('includes the query string in redirects', function (done) {
    var server = createServer()

    server.inject({
      url: '/?test=test&test2=test2',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'http'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(301)
      expect(response.headers.location).to.equal('https://host/?test=test&test2=test2')

      destroy(server)
      done()
    })
  })

  it('ignores all other requests', function (done) {
    var server = createServer()

    server.inject({
      url: '/',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'https'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.equal('Hello!')

      destroy(server)
      done()
    })
  })

  it('ignores requests when disabled', function (done) {
    var server = createServer({ enabled: false })

    server.inject({
      url: '/',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'http'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(200)
      expect(response.result).to.equal('Hello!')

      destroy(server)
      done()
    })
  })
})
