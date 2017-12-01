const fs = require('fs-extra');
const Promise = require('bluebird');
const _ = require('lodash');
const cryptojs = require('crypto-js');

module.exports = function(options) {

  var server = {};

  _.set(options.main,'secrets.default.keys.server',server);

  var keys = [{
    option: 'servCRT',
    name: 'cert'
  },
  {
    option: 'servKEY',
    name: 'key'
  },
  {
    option: 'authCRT',
    name: 'ca'
  }
  ];

  return Promise.resolve()
    .then(function() {
      return Promise.map(keys, function(key) {
        return fs.readFile(options[key.option])
          .then(function(content) {

            content = content.toString('utf8');
            server[key.name] = cryptojs.AES.encrypt(content, options.main.secretKey).toString();

          });
      });
    });
};
