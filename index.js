const _ = require('lodash');
const chalk = require('chalk');

_.mixin(require('lodash-deep'));
var intro = require('./lib/intro');
intro.cli();
require('./lib/paths')();
intro.project();

Promise.resolve()
  .then(function() {
    return require('./commands')();
  })
  .catch(function(err) {
    console.error(chalk.bold.red(err.message));
    console.error(err.stack);
    process.exit();
  });
