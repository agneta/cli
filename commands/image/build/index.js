const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = function(yargs) {

  var argv = yargs
    .alias('m', 'mode')
    .describe('m', 'Select build mode')
    .choices('m', ['test', 'prd', 'dev', 'srv'])
    .help('help')
    .argv;

  require('./server')(argv)
    .then(function() {
      if (argv.m == 'srv') {
        return;
      }
      return require('./generate')(argv)
        .then(function() {
          return require('./run')();
        })
        .then(function() {
          console.log();
          console.log(chalk.bold.green('Success!'));
        });
    });

};
