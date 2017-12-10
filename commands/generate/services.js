const Promise = require('bluebird');

module.exports = function(servers) {

  const log = global.requireMain('log');
  const projectPaths = global.requireMain('paths').core;

  return Promise.resolve()
    .then(function() {

      return Promise.map([{
        server: servers.servicesPortal,
        dir: projectPaths.portalProjectGenerated
      },
      {
        server: servers.servicesWebsite,
        dir: projectPaths.generated
      },
      ], function(service) {
        return service.server.locals.app.generate.methods({
          outputDir: service.dir
        });
      });

    })
    .then(function() {
      log.success('Exported Services');
    });
};
