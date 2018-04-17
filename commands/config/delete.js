const inquirer = require('inquirer');

module.exports = function(options) {

  return function(){

    Promise.resolve()
      .then(function() {
        return inquirer.prompt([{
          type: 'text',
          name: 'name',
          message: 'Enter the name of the property you want to delete.'
        }]);

      })
      .then(function(answers) {

        options.config.delete(answers.name);
        console.log('Deleted..');

      });

  };

};
