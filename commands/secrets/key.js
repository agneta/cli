const inquirer = require('inquirer');
const config = require('../../lib/config');
const cryptojs = require('crypto-js');
const Promise = require('bluebird');

function promise() {

  var tries = 0;

  var secretKey = config.get('secretKey');
  if(!secretKey){
    return Promise.reject('No secret key is stored.');
  }

  function tryGet() {


    return Promise.resolve()
      .then(function() {

        if (process.env.AGNETA_SECRET_KEY) {
          return process.env.AGNETA_SECRET_KEY;
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
