const chalk = require('chalk');

module.exports = function(yargs) {


  yargs.command('*', 'Default', function() {
    console.log(chalk.bold.red('Command not found'));
    console.log('Specify --help for available options');
    console.log();
  });

};
