const path = require('path');

var user = 'root';
var home = `/${user}`;
var pathCache = '.cache';

var data = {
  path: {
    cache: pathCache,
    npmCache: `${pathCache}/npm.tgz`,
    cliCache: `${pathCache}/cli.tgz`,
    home: home,
    app: `${home}/app`,
    projectCli: path.join(__dirname, '../..'),
  },
  user: user,
  port: 8082,
  data: {}
};

data.path.projectPlatform = path.join(data.path.projectCli, '../platform');


module.exports = data;
