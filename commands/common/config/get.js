const inquirer = require('inquirer');

module.exports = function(options) {

  return function(){

    Promise.resolve()
      .then(function() {
        return inquirer.prompt([{
          type: 'text',
          name: 'name',
          message: 'Enter the name of the property you want to get.'
        }]);

      })
      .then(function(answers) {

        console.log(options.config.get(answers.name));

      });

  };

};
