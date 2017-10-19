const path = require('path');
const agnetaPlatform = path.join(process.cwd(), 'node_modules/agneta-platform');

module.exports = function(yargs) {

  var argv = yargs
    .alias('m', 'mode')
    .describe('m', 'Select build mode')
    .choices('m', ['sftp', 'services'])
    .help('help')
    .argv;

  switch (argv.m) {

    case 'sftp':

      process.env.MODE = 'sftp';
      process.env.PORT = process.env.PORT || 8282;
      break;

    case 'services':

      process.env.MODE = 'services';
      process.env.PORT = process.env.PORT || 8484;
      break;

  }

  // Default is portal
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.MODE = process.env.MODE || 'portal';
  process.env.PORT = process.env.PORT || 8383;

  require(agnetaPlatform);

};
