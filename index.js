const _ = require('lodash');
const chalk = require('chalk');

_.mixin(require('lodash-deep'));
require('./lib/paths')();
require('./lib/intro')();

Promise.resolve()
  .then(function() {
    return require('./commands')();
  })
  .catch(function(err) {
    console.error(chalk.bold.red(err.message));
    console.error(err.stack);
    process.exit();
  });
