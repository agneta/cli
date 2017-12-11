
module.exports = function(yargs) {

  yargs.command('generate', 'Generation tool', function(yargs) {

    yargs.command('dependencies', 'Load from bower compomnents', init('dependencies'));
    yargs.command('services', 'Add services to the client applications', init('services'));

    function init(name) {

      const terminal = global.requireMain('server/terminal');

      return function() {
        Promise.resolve()
          .then(function() {
            return require('../secret/key/get').promise();
          })
          .then(function(secretKey) {
            process.env.SECRET_KEY = secretKey;
            return terminal();
          })
          .then(function(servers) {
            return require(`../image/setup/${name}`)(servers);
          })
          .then(function() {
            process.exit();
          });
      };
    }

  });


};