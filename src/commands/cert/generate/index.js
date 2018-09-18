const client = require('./level/client');
const server = require('./level/server');
const authority = require('./level/authority');
const _ = require('lodash');
const fs = require('fs-extra');

module.exports = function(options) {

  if (_.get(options, 'secrets.default.keys.server')) {
    console.log('You already have certificate keys in secrets.json');
    return;
  }

  options = require('./options')(options);

  return Promise.resolve()
    .then(function() {
      return authority(options);
    })
    .then(function() {
      return server(options);
    })
    .then(function() {
      return client(options);
    })
    .then(function() {
      return require('./output')(options);
    })
    .then(function() {
      return fs.remove(options.outDir);
    })
    .then(function() {
      console.log('Certificates are exported');
    });

};
