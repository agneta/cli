const chalk = require('chalk');

module.exports = function(yargs) {

  yargs.command('*', 'Default', function(yargs) {
    var argv = yargs.argv;
    if(!argv._.length){
      console.log('Welcome!');
    }else{
      console.log(chalk.bold.red('Command not found'));
    }
    console.log('Specify --help for available options');
    console.log();
  });

};
