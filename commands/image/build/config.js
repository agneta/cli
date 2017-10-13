const ip = require('ip');

var user = 'root';
var home = `/${user}`;
var pathCache = '.cache';

module.exports = {
  path: {
    cache: pathCache,
    npmCache: `${pathCache}/npm.tgz`,
    cliCache: `${pathCache}/cli.tgz`,
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
