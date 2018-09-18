const inquirer = require('inquirer');
const _ = require('lodash');

module.exports = function() {

  var secretKey;

  Promise.resolve()
    .then(function() {
      return require('./key/get').promise();
    })
    .then(function(_secretKey) {

      secretKey = _secretKey;

      return inquirer.prompt([{
        type: 'text',
        name: 'property',
        message: 'Enter the property you want to set.'
      }, {
        type: 'list',
        name: 'type',
        choices: [{
          name: 'Write or paste the value',
          value: 'value'
        }, {
          name: 'Read value from a file',
          value: 'file'
        },{
          name: 'Enter a json format with mutiple values',
          value: 'json'
        }],
        message: 'Enter the value of the property'
      }, {
        type: 'text',
        name: 'value',
        message: 'Enter the value of the property',
        when: function(answers) {
          return answers.type == 'value';
        }
      }, {
        type: 'text',
        name: 'file',
        message: 'Enter the path of the file',
        when: function(answers) {
          return answers.type == 'file';
        }
      },{
        type: 'text',
        name: 'json',
        message: 'Enter the json with the values',
        when: function(answers) {
          return answers.type == 'json';
        }
      }]);

    })
    .then(function(answers) {
      return require('./save')(
        _.extend({
          secretKey: secretKey
        },answers)
      );
    })
    .then(function() {
      console.log('Secret value now added');
    })
    .catch(function(err){
      console.error(err);
    });
};
