const cryptojs = require('crypto-js');
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const inquirer = require('inquirer');

var secretsPath = path.join(process.cwd(), 'secrets.json');
var keys = fs.readJsonSync(secretsPath);

function promise(options) {

  var propPaths = options.props || [options.prop];

  if (!propPaths.length) {
    throw new Error('Prop path is required');
  }

  return Promise.resolve()
    .then(function() {
      if (options.secretKey) {
        return options.secretKey;
      }
      return require('./key').promise();
    })
    .then(function(secretKey) {

      return Promise.mapSeries(propPaths, function(propPath) {

        var prop = getSecret(propPath);
        if (!prop) {
          throw new Error(`Could not find prop with path: ${propPath}`);
        }
        return cryptojs.AES.decrypt(prop, secretKey).toString(cryptojs.enc.Utf8);
      });

    });

}

function getSecret(path, keep) {

  var value = null;
  var obj = null;
  var env = process.env.NODE_ENV;

  if (keys[env]) {
    obj = keys[env];
    value = _.get(obj, path);
  }
  if (!value) {
    obj = keys.default;
    value = _.get(obj, path);
  }
  if (!keep) {
    _.unset(obj, path);
  }
  return value;

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
