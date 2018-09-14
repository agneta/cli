const chalk = require('chalk');
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');

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
    .help('help').argv;

  if (argv.docker) {
    require('./docker')();
    return;
  }

  require('../init')
    .promise(argv)
    .then(function() {
      return fs.ensureDir(path.join(process.cwd(), config.path.cache));
    })
    .then(function() {
      return fs.copy(
        path.join(__dirname, '../setup'),
        path.join(process.cwd(), '.agneta/setup')
      );
    })
    .then(function() {
      return require('./run')();
    })
    .then(function() {
      console.log();
      console.log(chalk.bold.green('Success!'));
      process.exit();
    });
};
