module.exports = function(yargs) {

  yargs.command('secret', 'encrypt secrets and use the generated key to access the credentials', function(yargs) {

    yargs.command('key', 'Get or set the secret key', require('./key'));
    yargs.command('set', 'Set a secret value to your secret.json', require('./set'));
    yargs.command('get', 'Get a secret value from your secret.json', require('./get').command);

    require('../default')(yargs);
  });

};
