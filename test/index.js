'use strict';

var Code     = require('code');
var Lab      = require('lab');
var lab      = exports.lab = Lab.script();
var describe = lab.describe;
var it       = lab.it;
var before   = lab.before;
var after    = lab.after;
var expect   = Code.expect;

var hapi     = require('hapi');

describe('hapi-require-https', function () {

  var server = new hapi.Server();
  server.connection();
  server.register(require('../'), function (err) {
    if (err) throw err;
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply('Hello!');
    }
  });

  it('redirects requests where x-forwarded-proto is http', function (done) {
    server.inject({
      url: '/',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'http'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(301);
      expect(response.headers.location).to.equal('https://host/');
      done();
    });
  });

  it('includes the query string in redirects', function (done) {
    server.inject({
      url: '/?test=test&test2=test2',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'http'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(301);
      expect(response.headers.location).to.equal('https://host/?test=test&test2=test2');
      done();
    });
  });

  it('ignores all other requests', function (done) {
    server.inject({
      url: '/',
      headers: {
        host: 'host',
        'x-forwarded-proto': 'https'
      }
    }, function (response) {
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal('Hello!');
      done();
    });
  });

});
