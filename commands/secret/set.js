const cryptojs = require('crypto-js');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

module.exports = function() {

  var outputName = 'secrets.json';
  var pathOutput = path.join(process.cwd(), outputName);

  var output = {};
  var answers;
  var secretKey;

  Promise.resolve()
    .then(function() {

      return require('./key/get').promise();

    })
    .then(function(_secretKey) {

      secretKey = _secretKey;

      return inquirer.prompt([{
        type: 'text',
        name: 'property',
        message: 'Enter the the property you want to set.'
      }, {
        type: 'text',
        name: 'value',
        message: 'Enter the value of the property'
      }]);

    })
    .then(function(_answers) {
      answers = _answers;
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

      var value = cryptojs.AES.encrypt(answers.value, secretKey).toString();
      output = _.set(output, answers.property, value);
      return fs.outputJson(pathOutput, output);
    })
    .then(function() {
      console.log('Secret value now added');
    });
};
