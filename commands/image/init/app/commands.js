const config = require('../../config');

module.exports = function(argv) {

  switch (argv.mode) {
    case 'development':

      var target = '/usr/local/lib/node_modules/agneta-cli';

      config.commands.addAgnetaCli = `ADD ${config.path.cliCache} ${target}`;
      config.commands.installAgnetaCli = `ln -s ${target}/bin/agneta /usr/local/bin/agneta`;

      break;
    default:
      config.commands.installAgnetaCli = 'npm install --global --prefer-offline agneta-cli';
      break;
  }

};
