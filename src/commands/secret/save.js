const cryptojs = require('crypto-js');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

var outputName = 'secrets.json';
var pathOutput = path.join(process.cwd(), outputName);
var output = {};

module.exports = function(options) {

  var secretKey;

  return Promise.resolve()
    .then(function() {
      return require('./key/get')
        .promise();
    })
    .then(function(_secretKey) {
      secretKey = _secretKey;
      return fs.ensureFile(pathOutput);
    })
    .then(function() {
      return fs.readJson(pathOutput);
    })
    .then(function(_output) {
      output = _output;
      if (!output) {
        output = {};
      }
      var value;

      if (options.file) {
        value = fs.readFileSync(options.file).toString('utf8');
        value = cryptojs.AES.encrypt(value, secretKey).toString();
      }

      if (options.value) {
        value = cryptojs.AES.encrypt(options.value, secretKey).toString();
      }

      if (options.json) {
        value = JSON.parse(options.json);
        setData(value);
      }

      if(options.data){
        value = _.extend({},options.data);
        setData(value);
      }

      function setData(value){
        console.log(value);
        _.deepMapValues(value, function(jsonValue, path) {
          if(!_.isString(jsonValue)){
            return;
          }
          jsonValue = cryptojs.AES.encrypt(jsonValue, secretKey).toString();
          _.set(value, path, jsonValue);
        });
      }

      output = _.set(output, options.property, value);
      return fs.outputJson(pathOutput, output);
    });

};
