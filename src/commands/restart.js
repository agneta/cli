const chalk = require('chalk');
module.exports = function() {
  Promise.resolve()
    .then(function() {
      return require('./stop').promise();
    })
    .then(function() {
      return require('./start').promise();
    })
    .then(function(started) {
      if (started) {
        console.log(chalk.green('Process restarted'));
      }
      process.exit();
    })
    .catch(console.error);
};
