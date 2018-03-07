const inquirer = require('inquirer');
const _ = require('lodash');

module.exports = function() {

  var answers;

  return Promise.resolve()
    .then(function() {
      return require('../../secret/get').promise({
        prop: 'default.email'
      });
    })
    .then(function(email) {

      if(_.get(email,'provider')){
        console.log(`Your email provider is already selected. (${email.provider})`);
        return;
      }

      console.log('Select an email ...');

      return inquirer.prompt([{
        type: 'list',
        name: 'provider',
        choices:[
          {
            name: 'Nodemailer',
            value: 'nodemailer'
          },
          {
            name: 'Sendgrid',
            value: 'sendgrid'
          }
        ],
        message: 'Select an email provider:'
      }])
        .then(function(_answers) {
          answers = _answers;
          return require(`./${answers.provider}`)();
        })
        .then(function(details) {
          details.provider = answers.provider;
          return require('../../secret/save')({
            property: 'default.email',
            data: details
          });
        });
    });
};
