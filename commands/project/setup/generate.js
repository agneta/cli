const inquirer = require('inquirer');
const Promise = require('bluebird');

module.exports = function(options) {

  var generators = ['dependencies', 'services'];

  return Promise.resolve()
    .then(function() {

      return inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Generate dependencies and services?'
      }])
        .then(function(answers) {
          if(!answers.confirm){
            return;
          }
          return init();
        });
    });

  function init() {
    return Promise.resolve()
      .then(function() {

        return Promise.each(generators, function(generator) {
          return require(`../../image/setup/${generator}`)(options.servers);
        });
      });
  }

};
