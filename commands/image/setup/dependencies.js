const path = require('path');

module.exports = function(servers) {

  const log = global.requireMain('log');
  const projectPaths = global.requireMain('paths');
  const progress = global.requireMain('progress');

  return Promise.resolve()
    .then(function() {
      var utilityPath = path.join(
        projectPaths.portal.website, 'utilities/dependencies'
      );

      return require(utilityPath)({
        locals: servers.webPortal.locals,
        log: console.log,
        progress: progress
      })
        .run()
        .then(function() {
          log.success('Success!');
        });

    })
    .then(function() {
      log.success('Dependencies are loaded');
    });
};
