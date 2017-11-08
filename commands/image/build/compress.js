const proc = require('../../../lib/process');
const config = require('../config');
const path = require('path');

module.exports = function(mode) {


  var pathOutputAbs = path.join(
    process.cwd(),
    config.path.cliCache
  );

  switch (mode) {
    case 'development':

      return proc.spawn(`tar czf ${pathOutputAbs} --exclude=.git -C ${config.path.projectCli} .`);
  }

};
