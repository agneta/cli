const path = require('path');

module.exports = function(yargs) {
  yargs.command('generate', 'Generation tool', function(yargs) {
    yargs.command(
      'dependencies',
      'Load from bower compomnents',
      init('dependencies')
    );
    yargs.command(
      'scripts',
      'Create bundled scripts for your project',
      init('scripts')
    );

    function init(name) {
      const terminal = global.requireMain('server/terminal');
      const progress = global.requireMain('progress');

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
            console.log(servers.webPages.locals.project.paths);
            var paths = servers.webPages.locals.project.paths;
            return require(path.join(
              paths.portal.website,
              `utilities/generate/${name}`
            ))({
              locals: servers.webPortal.locals,
              log: console.log,
              progress: progress
            });
          })
          .catch(function(err) {
            console.error(err);
          })
          .then(function() {
            process.exit();
          });
      };
    }
  });
};
