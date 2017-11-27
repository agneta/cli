const inquirer = require('inquirer');
const config = require('../../../lib/config');
const cryptojs = require('crypto-js');

module.exports = function() {

  Promise.resolve()
    .then(function() {
      return inquirer.prompt([{
        type: 'text',
        name: 'secretKey',
        message: 'Enter a the secret key to store'
      },{
        type: 'password',
        name: 'passphrase',
        message: 'Enter a passphrase to encrypt the secret key'
      }]);

    })
    .then(function(answers) {

      var secretKey = cryptojs.AES.encrypt(answers.secretKey, answers.passphrase).toString();
      config.set('secretKey', secretKey);

    })
    .then(function() {
      console.log('Your secret key is now stored and encrypted.');
    });

};
