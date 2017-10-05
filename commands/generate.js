module.exports = function(yargs) {

  yargs
    .command('dependencies', 'Load from bower compomnents', function() {

      global.requireMain('generate/dependencies')();

    })
    .command('project', 'Create a new Agneta project', function() {

      global.requireMain('generate/project')();

    })
    .command('services', 'Add services to the client applications', function() {

      global.requireMain('generate/services')();

    })
    .command('secrets', 'encrypt secrets and use the generated key to access the credentials', function() {

      require('../lib/secrets')();

    });
};
