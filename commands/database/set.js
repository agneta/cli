const inquirer = require('inquirer');
const _ = require('lodash');
const cryptojs = require('crypto-js');

module.exports = function(options) {

  var secretKey = options.secretKey;
  var answers = {};
  var secrets = options.secrets || {};

  if (_.get(secrets, 'default.db')) {
    console.log('Database already configured.');
    return Promise.resolve();
  }

  return Promise.resolve()
    .then(function() {

      console.log();
      console.log('Lets setup your mongodb database:');
      console.log();

      return inquirer.prompt([{
        type: 'text',
        name: 'database',
        message: 'Database name: '
      }, {
        type: 'text',
        name: 'host',
        default: 'localhost',
        message: 'Host: '
      },
      {
        type: 'text',
        name: 'port',
        default: '27017',
        message: 'Port: '
      },
      {
        type: 'text',
        name: 'username',
        message: 'Username: '
      }, {
        type: 'password',
        name: 'password',
        message: 'Password: '
      }
      ]);
    })
    .then(function(_answers) {

      answers = _answers;
      secrets.default.db = {};

      for (var key in answers) {
        var value = answers[key];
        if(!value){
          continue;
        }
        secrets.default.db[key] = encrypt(value);
      }

      function encrypt(value) {
        return cryptojs.AES.encrypt(value, secretKey).toString();
      }

    });

};
