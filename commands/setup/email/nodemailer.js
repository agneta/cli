const inquirer = require('inquirer');
const nodemailer = require('nodemailer');

module.exports = function() {

  return inquirer.prompt([{
    type: 'list',
    name: 'type',
    choices: [{
      name: 'Create a test account',
      value: 'test'
    }, {
      name: 'Enter my SMTP details',
      value: 'smtp'
    }],
    message: 'How would you like to setup nodemailer?'
  }])
    .then(function(answers) {

      switch (answers.type) {
        //------------------------------------------------
        case 'test':
          return nodemailer.createTestAccount()
            .then(function(account) {
              return {
                host: account.smtp.host,
                port:account.smtp.port,
                secure: account.smtp.secure,
                user: account.user,
                pass: account.pass
              };
            });
          //------------------------------------------------
        case 'smpt':
          return inquirer.prompt([{
            type: 'text',
            name: 'host',
            message: 'Host:'
          },
          {
            type: 'text',
            name: 'port',
            message: 'Port:'
          },
          {
            type: 'boolean',
            name: 'secure',
            message: 'Is secure connection?'
          },
          {
            type: 'text',
            name: 'user',
            message: 'Username:'
          },
          {
            type: 'password',
            name: 'pass',
            message: 'Password:'
          }]);
      }
    });

};
