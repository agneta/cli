const inquirer = require('inquirer');

module.exports = function(options) {

  var services = options
    .servers
    .servicesPortal
    .locals
    .app;

  return Promise.resolve()
    .then(function() {
      return services.models.Role_Administrator.count();
    })
    .then(function(count) {

      if(count){
        console.log(`Administrator already exists. (${count})`);
        return;
      }

      console.log('Create an admin account...');

      return inquirer.prompt([{
        type: 'text',
        name: 'email',
        message: 'Email:'
      }, {
        type: 'password',
        name: 'password',
        message: 'Password:'
      }
      ])
        .then(function(answers) {
          return services.models.Account.create({
            email: answers.email,
            password: answers.password
          });
        })
        .then(function(account) {
          return services.models.Account.roleAdd(
            account.id,
            'administrator'
          );
        })
        .then(function() {
          console.log('Admin account was created');
        });
    });

};
