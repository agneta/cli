const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();
const config = require('./config');
const configstore = require('../../../lib/config');

module.exports = function(yargs) {

  var argv = yargs
    .options({
      mode: {
        alias: 'm',
        describe: 'Select build mode',
        choices: ['development', 'portal'],
        default: 'development'
      },
      image: {
        alias: 'i',
        describe: 'Image name'
      },
      docker: {
        alias: 'd',
        describe: 'Run inside docker'
      }
    })
    .help('help')
    .argv;

  config.image = argv.image || `${configstore.name}:latest`;

  if(argv.docker){
    require('./docker')();
    return;
  }

  require('../init').promise(argv)
    .then(function() {
      return require('./run')();
    })
    .then(function() {
      console.log();
      console.log(chalk.bold.green('Success!'));
      process.exit();
    });



};
