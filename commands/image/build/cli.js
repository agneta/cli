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

      return proc.spawn(`tar cvzf ${pathOutputAbs} --exclude=.git -C ${config.path.projectCli} .`)
        .then(function() {
          console.log(`cli path to copy is ${config.path.projectCli}`);
          var target = '/usr/local/lib/node_modules/agneta-cli';
          config.data.cli = [
            `ADD ${config.path.cliCache} ${target}`,
            `RUN ln -s ${target}/bin/agneta /usr/local/bin/agneta`
          ].join('\n');
        });

    default:
      config.data.cli = 'RUN npm install --global --prefer-offline agneta-cli';
      break;
  }

};
