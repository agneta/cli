const config = require('../../../../lib/config');
const inquirer = require('inquirer');

module.exports = function() {
  return Promise.resolve()

    //--------------------------------------
    // Check if has server name

    .then(function() {

      var serverName = config.agneta.get('server.name');

      if (serverName) {
        return;
      }

      return inquirer.prompt([{
        type: 'text',
        name: 'serverName',
        message: 'Server name is missing. Set the name of your sever'
      }])
        .then(function(answers) {
          config.agneta.set('server.name', answers.serverName);
        });
    });

};
