const inquirer = require('inquirer');

module.exports = function() {
  return inquirer.prompt([
    {
      type: 'text',
      name: 'host',
      message: 'Host:'
    },
    {
      type: 'text',
      name: 'port',
      message: 'Port:'
    },
    {
      type: 'boolean',
      name: 'secure',
      message: 'Is secure connection?'
    },
    {
      type: 'text',
      name: 'user',
      message: 'Username:'
    },
    {
      type: 'password',
      name: 'pass',
      message: 'Password:'
    }
  ]);
};
