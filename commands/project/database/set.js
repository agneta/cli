const inquirer = require('inquirer');
const _ = require('lodash');
const cryptojs = require('crypto-js');
const MongoClient = require('mongodb').MongoClient;

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
      console.log('Lets connect to your mongodb database:');
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

      var credentials = '';
      if (answers.username && answers.password) {
        credentials = `${answers.username}:${answers.password}@`;
      }
      var url = `mongodb://${credentials}${answers.host}:${answers.port}/${answers.database}`;
      console.log(url);
      return MongoClient.connect(url);

    })
    .then(function() {

      console.log('Your connection to mongodb is successful. Database settings will be stored');
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
