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
        type: 'list',
        name: 'type',
        choices: [{
          name: 'Write or paste the value',
          value: 'value'
        }, {
          name: 'Read value from a file',
          value: 'file'
        }],
        message: 'Enter the value of the property'
      }, {
        type: 'text',
        name: 'value',
        message: 'Enter the value of the property',
        when: function(answers) {
          return answers.type == 'value';
        }
      }, {
        type: 'text',
        name: 'file',
        message: 'Enter the path of the file',
        when: function(answers) {
          return answers.type == 'file';
        }
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
      var value = answers.value;
      if (answers.file) {
        value = fs.readFileSync(answers.file).toString('utf8');
      }
      value = cryptojs.AES.encrypt(value, secretKey).toString();
      output = _.set(output, answers.property, value);
      return fs.outputJson(pathOutput, output);
    })
    .then(function() {
      console.log('Secret value now added');
    })
    .catch(function(err){
      console.error(err);
    });
};
