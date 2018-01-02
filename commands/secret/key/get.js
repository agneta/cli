const inquirer = require('inquirer');
const config = require('../../../lib/config');
const cryptojs = require('crypto-js');
const Promise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');

function promise() {

  var tries = 0;
  var envSecret = process.env.AGNETA_SECRET_KEY;

  function tryGet() {

    var secretKey = config.project.get('secretKey');
    if(!secretKey && !envSecret){
      return Promise.reject('No secret key is stored.');
    }

    return Promise.resolve()
      .then(function() {

        if (envSecret) {
          return envSecret;
        }

        var keyPath = path.join(
          process.cwd(), '../secret.json'
        );

        if(fs.existsSync(keyPath)) {
          return fs.readJsonSync(keyPath, 'utf8');
        }

        return inquirer.prompt([{
          type: 'password',
          name: 'passphrase',
          message: 'Enter a passphrase to decrypt the generated secret key'
        }])
          .then(function(answers) {
            secretKey = cryptojs.AES.decrypt(secretKey, answers.passphrase);

            try {
              secretKey = secretKey.toString(cryptojs.enc.Utf8);
            } catch (err) {
              secretKey = null;
            }

            if (!secretKey) {
              tries++;
              console.error(`The passphrase is invalid. try again... tries: [${tries}]`);
              if (tries > 2) {
                throw new Error('Passphrase incorrect');
              }
              return tryGet();
            }
            return secretKey;
          });
      })
      .then(function(secretKey){
        process.env.AGNETA_SECRET_KEY = secretKey;
        process.env.SECRET_KEY = secretKey;
        return secretKey;
      });
  }


  return tryGet();
}

module.exports = {
  command: function() {
    promise()
      .then(function(secretKey) {
        console.log(`Secret key is ${secretKey}`);
      });
  },
  promise: promise
};
