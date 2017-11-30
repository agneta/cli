const fs = require('fs-extra');
const path = require('path');
const config = require('../../../lib/config');
const inquirer = require('inquirer');
const cryptojs = require('crypto-js');
const cryptoRandomString = require('crypto-random-string');

module.exports = function() {

  var pathOutput = path.join(
    process.cwd(), 'secrets.json'
  );

  return Promise.resolve()
    .then(function() {
      return fs.existsSync(pathOutput);
    })
    .then(function(exists) {
      if (exists) {
        return;
      }

      return Promise.resolve()
        .then(function() {


          var secretKey = config.project.get('secretKey');
          if(!secretKey){

            return inquirer.prompt([{
              type: 'password',
              name: 'passphrase',
              message: 'Enter a passphrase to encrypt your new secret key.'
            }])
              .then(function(answers) {

                var secretKey = cryptoRandomString(18);
                secretKey = cryptojs.AES.encrypt(secretKey, answers.passphrase).toString();
                config.project.set('secretKey', secretKey);

              });

          }

          return require('../../secret/key/get').promise();

        })
        .then(function() {

          var secrets = {};
          return fs.outputJson(pathOutput,secrets);

        });
    });

};
