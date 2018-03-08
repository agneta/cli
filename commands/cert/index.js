module.exports = function(yargs) {

  yargs.command('cert', 'Manage your domain\'s certificates', function(yargs) {

    yargs.command('show', 'show server certs stored in your secrets file', require('./show'));

    // TODO: Add Generate certificate command
    //yargs.command('generate', '', require('./show'));

    require('../default')(yargs);
  });

};
