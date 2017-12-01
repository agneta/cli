const fs = require('fs-extra');
const path = require('path');
const config = require('../../../lib/config');
const inquirer = require('inquirer');
const cryptojs = require('crypto-js');
const cryptoRandomString = require('crypto-random-string');
const _ = require('lodash');

module.exports = function() {

  var secretKey;
  var pathOutput = path.join(
    process.cwd(), 'secrets.json'
  );
  var secrets = {
    default: {}
  };

  return Promise.resolve()
    .then(function() {
      return fs.existsSync(pathOutput);
    })
    .then(function(exists) {
      if (exists) {
        return fs.readJson(pathOutput);
      }
    })
    .then(function(_secrets) {

      _.extend(secrets,_secrets);

      var secretKey = config.project.get('secretKey');
      if (!secretKey) {

        return inquirer.prompt([{
          type: 'password',
          name: 'passphrase',
          message: 'Enter a passphrase to encrypt your new secret key.'
        }])
          .then(function(answers) {

            var secretKey = cryptoRandomString(18);
            secretKey = cryptojs.AES.encrypt(secretKey, answers.passphrase).toString();
            config.project.set('secretKey', secretKey);
            return secretKey;
          });

      }

      return require('../../secret/key/get').promise();

    })
    .then(function(_secretKey) {

      secretKey = _secretKey;
      return require('../database/set')({
        secretKey: secretKey,
        secrets: secrets
      });

    })
    .then(function() {

      return require('../../certificates')({
        secretKey: secretKey,
        secrets: secrets
      });

    })
    .then(function() {

      if (!secrets.isValid) {
        secrets.isValid = encrypt('yes');
      }

      if (!secrets.default.encryptionKey) {
        secrets.default.encryptionKey = encrypt(cryptoRandomString(18));
      }

      if (!secrets.default.cookie) {
        secrets.default.cookie = encrypt(cryptoRandomString(18));
      }

      function encrypt(value) {
        return cryptojs.AES.encrypt(value, secretKey).toString();
      }

      return fs.outputJson(pathOutput, secrets);

    });

};
