const inquirer = require('inquirer');

module.exports = function(options) {

  var answers;
  var services = options
    .servers
    .servicesPortal
    .locals
    .app;

  return Promise.resolve()
    .then(function() {
      var email = services.get('email');
      if(email.provider){
        console.log(`Your email provider is already selected. (${email.provider})`);
        return;
      }

      console.log('Select an email ...');

      return inquirer.prompt([{
        type: 'list',
        name: 'provider',
        choices:[
          {
            name: 'nodemailer',
            value: 'Nodemailer'
          },
          {
            name: 'sendgrid',
            value: 'Sendgrid'
          }
        ],
        message: 'Select an email provider:'
      }])
        .then(function(_answers) {
          answers = _answers;
          return require(`./${answers.provider}`)(options);
        })
        .then(function(details) {
          details.property = answers.provider;
          return require('../../secret/save')(details);
        });
    });
};
