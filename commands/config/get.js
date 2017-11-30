const inquirer = require('inquirer');
const config = require('../../lib/config');

module.exports = function() {

  Promise.resolve()
    .then(function() {
      return inquirer.prompt([{
        type: 'text',
        name: 'name',
        message: 'Enter the name of the property you want to get.'
      }]);

    })
    .then(function(answers) {

      console.log(config.agneta.get(answers.name));

    });

};
