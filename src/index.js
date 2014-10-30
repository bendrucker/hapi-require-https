'use strict';

exports.register = function (plugin, options, next) {
  plugin.ext('onRequest', function (request, next) {
    if (request.headers['x-forwarded-proto'] === 'http') {
      return next('Redirecting to https')
        .redirect('https://' + request.headers.host + request.path)
        .code(301);
    }
    next();
  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
