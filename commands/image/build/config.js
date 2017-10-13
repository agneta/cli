const ip = require('ip');

var user = 'root';
var home = `/${user}`;

module.exports = {
  path: {
    npmCache: '.cache/npm.tgz',
    cliCache: '.cache/cli.tgz',
    home: home,
    app: `${home}/app`
  },
  user: user,
  port: 8082,
  server: {
    port: 9292,
    ip: ip.address()
  }
};
