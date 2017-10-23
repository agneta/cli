const inquirer = require('inquirer');
const config = require('../../lib/config');
const cryptojs = require('crypto-js');

module.exports = function() {

  Promise.resolve()
    .then(function() {
      return inquirer.prompt([{
        type: 'password',
        name: 'passphrase',
        message: 'Enter a passphrase to decrypt the generated secret key'
      }]);
    })
    .then(function(answers) {

      var secretKey = config.get('secretKey');
      secretKey = cryptojs.AES.decrypt(secretKey, answers.passphrase).toString(cryptojs.enc.Utf8);
      console.log(`Secret key is ${secretKey}`);
    });



};
