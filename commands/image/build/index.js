const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = function(yargs) {

  var argv = yargs
    .alias('m', 'mode')
    .describe('m', 'Select build mode')
    .choices('m', ['test', 'prd', 'dev', 'srv', 'gen'])
    .help('help')
    .argv;

  switch (argv.m) {

    case 'srv':

      require('./server')(argv);
      break;

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
        });
  }



};
