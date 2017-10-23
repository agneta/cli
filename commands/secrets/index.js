module.exports = function(yargs) {

  yargs.command('secrets', 'encrypt secrets and use the generated key to access the credentials', function(yargs) {

    yargs.command('set', 'Encrypt the the secrets and store the key with a passphrase', require('./set'));
    yargs.command('get', 'Get the secret key with passphrase', require('./get'));
    require('../default')(yargs);
  });

};
