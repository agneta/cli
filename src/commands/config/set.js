const inquirer = require('inquirer');

module.exports = function(options) {

  return function(){

    Promise.resolve()
      .then(function() {
        return inquirer.prompt([{
          type: 'text',
          name: 'name',
          message: 'Enter the name of the property you want to set.'
        },{
          type: 'text',
          name: 'value',
          message: 'Enter the value of the property'
        }]);

      })
      .then(function(answers) {
      //console.log(answers);
        options.config.set(answers.name,answers.value);

      })
      .then(function() {
        console.log('Your configuration value is saved.');
      });

  };

};
