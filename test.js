'use strict'

var test = require('blue-tape')
var hapi = require('@hapi/hapi')
var plugin = require('./')

test('proxied requests', function (t) {
  t.plan(2)

  return Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  })
    .then(function (response) {
      t.equal(response.statusCode, 301, 'sets 301 code')
      t.equal(response.headers.location, 'https://host/', 'sets Location header')
    })
})

test('un-proxied requests: options = {proxy: false}', function (t) {
  t.plan(2)

  return Server({ proxy: false }).inject({
    url: '/',
    headers: {
      host: 'host'
    }
  })
    .then(function (response) {
      t.equal(response.statusCode, 301, 'sets 301 code')
      t.equal(response.headers.location, 'https://host/', 'sets Location header')
    })
})

test('query string', function (t) {
  t.plan(2)

  return Server().inject({
    url: '/?test=test&test2=test2',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  })
    .then(function (response) {
      t.equal(response.statusCode, 301, 'sets 301 code')
      t.equal(
        response.headers.location,
        'https://host/?test=test&test2=test2',
        'sets Location header with query string'
      )
    })
})

test('ignores unmatched', function (t) {
  t.plan(2)

  return Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'https'
    }
  })
    .then(function (response) {
      t.equal(response.statusCode, 200, 'receives 200')
      t.equal(response.result, 'Hello!', 'receives body')
    })
})

test('x-forward-host support', function (t) {
  t.plan(2)

  return Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http',
      'x-forwarded-host': 'host2'
    }
  })
    .then(function (response) {
      t.equal(response.statusCode, 301, 'sets 301 code')
      t.equal(response.headers.location, 'https://host2/', 'sets Location header')
    })
})

function Server (options) {
  var server = new hapi.Server()
  server.register({ plugin, options })
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return h.response('Hello!')
    }
  })
  return server
}
