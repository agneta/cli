module.exports = function(yargs) {

  yargs.command('dependencies', 'Load from bower compomnents', function() {
    global.requireMain('generate/dependencies')();

  });

  yargs.command('services', 'Add services to the client applications', function() {

    global.requireMain('generate/services')();

  });

};
