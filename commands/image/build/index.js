const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = function(yargs) {

  var argv = yargs
  .alias('m', 'mode')
  .describe('m', 'Select build mode')
  .choices('m', ['test', 'prd', 'dev'])
  .help('help')
  .argv;

  require('./generate')(argv)
    .then(function() {
      return require('./run')();
    })
    .then(function() {
      console.log();
      console.log(chalk.bold.green('Success!'));
    });

};
