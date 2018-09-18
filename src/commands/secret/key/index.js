module.exports = function(yargs) {

  yargs.command('set', 'Set a new secret key', require('./set'));
  yargs.command('get', 'Get the secret key', require('./get').command);

  require('../../default')(yargs);

};
