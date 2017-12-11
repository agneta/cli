const fs = require('fs-extra');
const Promise = require('bluebird');
const proc = require('../../../lib/process');
const config = require('../config');
module.exports = function() {

  return Promise.resolve()
    .then(function() {
      return fs.ensureDir('tmp');
    })
    .then(function() {

      return require('../../secret/key/get').promise();

    })
    .then(function(secretKey) {
      return proc.spawn(`docker build --build-arg AGNETA_SECRET_KEY=${secretKey} --tag ${config.image.app} .`);
    });
};
