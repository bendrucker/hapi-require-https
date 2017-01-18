'use strict'

var test = require('tape')
var hapi = require('hapi')
var http = require('http')
var plugin = require('./')

test('proxied requests', function (t) {
  t.plan(2)

  Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  }, function (response) {
    t.equal(response.statusCode, 301, 'sets 301 code')
    t.equal(response.headers.location, 'https://host/', 'sets Location header')
  })
})

test('un-proxied requests: options = {proxy: false}', function (t) {
  t.plan(2)

  Server({proxy: false}).inject({
    url: '/',
    headers: {
      host: 'host'
    }
  }, function (response) {
    t.equal(response.statusCode, 301, 'sets 301 code')
    t.equal(response.headers.location, 'https://host/', 'sets Location header')
  })
})

test('query string', function (t) {
  t.plan(2)

  Server().inject({
    url: '/?test=test&test2=test2',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  }, function (response) {
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

  Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'https'
    }
  }, function (response) {
    t.equal(response.statusCode, 200, 'receives 200')
    t.equal(response.result, 'Hello!', 'receives body')
  })
})

test('multiple connections', function (t) {
  t.plan(1)

  var server = new hapi.Server()
  var main = server.connection({labels: 'a'})

  server.connection({labels: 'b'})

  main.register({
    register: plugin,
    options: {
      proxy: false
    }
  }, throwErr)

  server.start(function (err) {
    if (err) return t.end(err)

    var info = main.info
    var url = info.protocol + '://' + info.host + ':' + info.port

    http.request(url, function (res) {
      t.equal(res.statusCode, 301)
      server.stop(t.end)
    })
    .end()
  })
})

test('x-forward-host support', function (t) {
  t.plan(2)

  Server().inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http',
      'x-forwarded-host': 'host2'
    }
  }, function (response) {
    t.equal(response.statusCode, 301, 'sets 301 code')
    t.equal(response.headers.location, 'https://host2/', 'sets Location header')
  })
})

function Server (options) {
  var server = new hapi.Server()
  server.connection()
  server.register({register: plugin, options: options}, throwErr)
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply('Hello!')
    }
  })
  return server
}

function throwErr (err) {
  if (err) throw err
}
