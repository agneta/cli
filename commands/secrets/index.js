module.exports = function(yargs) {

  yargs.command('secrets', 'encrypt secrets and use the generated key to access the credentials', function(yargs) {

    yargs.command('build', 'Encrypt the the secrets and store the key with a passphrase', require('./build'));
    yargs.command('key', 'Get the secret key with passphrase', require('./key').command);
    yargs.command('get [prop]', 'Get the secret property descrypted', {
      prop: {
        describe: 'The property path to the secret',
        required: true
      }},
      require('./get').command);
    require('../default')(yargs);
  });

};
