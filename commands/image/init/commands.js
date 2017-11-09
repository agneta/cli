const config = require('../config');

module.exports = function(argv) {

  console.log(argv.mode);
  switch (argv.mode) {
    case 'development':
      config.commands.npm = `ADD ${config.path.npmCache} ${config.path.home}`;

      var target = '/usr/local/lib/node_modules/agneta-cli';
      config.commands.cli = [
        `ADD ${config.path.cliCache} ${target}`,
        `RUN ln -s ${target}/bin/agneta /usr/local/bin/agneta`
      ].join('\n');

      break;
    default:
      config.commands.cli = 'RUN npm install --global --prefer-offline agneta-cli';
      break;
  }

};
