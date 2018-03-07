const cryptojs = require('crypto-js');
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const inquirer = require('inquirer');

var secretsPath = path.join(process.cwd(), 'secrets.json');
var keys = fs.readJsonSync(secretsPath);

function promise(options) {

  if (!options.prop) {
    throw new Error('Prop path is required');
  }

  return Promise.resolve()
    .then(function() {
      if (options.secretKey) {
        return options.secretKey;
      }
      return require('./key/get').promise();
    })
    .then(function(secretKey) {

      var prop = _.get(keys, options.prop);
      if (!prop) {
        console.log(`Could not find prop with path: ${options.prop}`);
        return;
      }
      if (_.isObject(prop) || _.isArray(prop)) {
        var result = {};
        return Promise.map(_.keys(prop), function(index) {
          result[index] = cryptojs.AES.decrypt(prop[index], secretKey).toString(cryptojs.enc.Utf8);
        })
          .then(function() {
            return result;
          });
      }
      return cryptojs.AES.decrypt(prop, secretKey).toString(cryptojs.enc.Utf8);
    });

}

module.exports = {
  command: function() {
    var secretKey;
    Promise.resolve()
      .then(function() {
        return require('./key/get').promise();
      })
      .then(function(_secretKey) {
        secretKey = _secretKey;
        return inquirer.prompt([{
          type: 'text',
          name: 'prop',
          message: 'Enter the property you wish to get'
        }]);
      })
      .then(function(options) {
        return promise({
          secretKey: secretKey,
          prop: options.prop
        });
      })
      .then(function(secret) {
        console.log('Secret property value is:');
        console.log(secret);
        console.log();
      });
  },
  promise: promise
};
