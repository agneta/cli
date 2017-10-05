const cryptojs = require('crypto-js');
const _ = require('lodash');
const fs = require('fs-extra');
const uuidv1 = require('uuid/v1');
const path = require('path');
_.mixin(require('lodash-deep'));

module.exports = function() {

  var outputName = 'secrets.json';
  var pathInput = path.join(process.cwd(), 'input.js');
  var pathKey = path.join(process.cwd(), 'key.json');
  var pathOutput = path.join(process.cwd(), outputName);

  var keys = require(pathInput);
  var secretKey = uuidv1();
  var output = {};

  keys.isValid = 'yes';

  _.deepMapValues(keys, function(value, path) {
    value = cryptojs.AES.encrypt(value, secretKey).toString();
    _.set(output, path, value);
  });
  fs.outputJson(pathOutput, output)
    .then(
      fs.outputJson(pathKey, secretKey)
    )
    .then(function() {
      console.log('Your secrets are now encrypted.');
      console.log('Output file:', outputName);
      console.log('Secret Key:', secretKey);
    });
};
