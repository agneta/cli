const cryptojs = require('crypto-js');
const _ = require('lodash');
const fs = require('fs-extra');
const uuidv1 = require('uuid/v1');
const path = require('path');
const inquirer = require('inquirer');
const config = require('../../lib/config');

_.mixin(require('lodash-deep'));

module.exports = function(yargs) {

  var argv = yargs
    .option('in', {
      alias: 'i',
      describe: 'Path to the decrypted secrets file',
      required: true
    })
    .option('key', {
      alias: 'k',
      describe: 'Secret key to use for encrypting',
      required: false
    })
    .help('help')
    .argv;

  if (!argv.in) {
    return;
  }

  var outputName = 'secrets.json';
  var pathInput = path.resolve(argv.in);
  var pathOutput = path.join(process.cwd(), outputName);

  var keys = require(pathInput);
  var secretKey = argv.key || uuidv1();
  var output = {};

  keys.isValid = 'yes';

  _.deepMapValues(keys, function(value, path) {
    value = cryptojs.AES.encrypt(value, secretKey).toString();
    _.set(output, path, value);
  });
  fs.outputJson(pathOutput, output)
    .then(function() {

      return inquirer.prompt([{
        type: 'password',
        name: 'passphrase',
        message: 'Enter a passphrase to encrypt the generated secret key'
      }]);

    })
    .then(function(answers) {

      secretKey = cryptojs.AES.encrypt(secretKey, answers.passphrase).toString();
      config.set('secretKey', secretKey);

    })
    .then(function() {
      console.log('Your secrets are now encrypted.');
      console.log('Output file:', outputName);
      console.log('Secret Key:', secretKey);
    });
};
