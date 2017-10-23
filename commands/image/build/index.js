const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();
const config = require('./config');
const configstore = require('../../../lib/config');

module.exports = function(yargs) {

  var argv = yargs
    .option('mode', {
      alias: 'm',
      describe: 'Select build mode',
      choices: ['test', 'prd', 'dev', 'srv', 'gen']
    })
    .option('image', {
      alias: 'i',
      describe: 'Image name'
    })
    .help('help')
    .argv;

  config.image = argv.image || `${configstore.name}:latest`;

  switch (argv.m) {

    case 'gen':

      require('./generate')(argv);
      break;

    default:

      require('./generate')(argv)
        .then(function() {
          return require('./run')();
        })
        .then(function() {
          console.log();
          console.log(chalk.bold.green('Success!'));
          process.exit();
        });
  }



};
