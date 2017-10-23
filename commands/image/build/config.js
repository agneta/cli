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
  port: 8082
};
