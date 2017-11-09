const fs = require('fs-extra');
const Promise = require('bluebird');
const proc = require('../../../lib/process');

module.exports = function() {

  return Promise.resolve()
    .then(function() {
      return fs.ensureDir('tmp');
    })
    .then(function() {

      return require('../../secrets/key').promise();

    })
    .then(function(secretKey) {
      return proc.spawn(`docker-compose build --build-arg AGNETA_SECRET_KEY=${secretKey} portal`);
    });
};
