const path = require('path');
const config = require('../../lib/config');
const os = require('os');

var user = os.userInfo();
user.username = 'agneta';

var home = `/home/${user.username}`;
var pathCache = '.cache';


var data = {
  name: config.name,
  domain: `${config.name}.localhost`,
  image: `${config.name}:latest`,
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
  portHttp: 8081,
  commands: {}
};

data.path.projectPlatform = path.join(data.path.projectCli, '../platform');


module.exports = data;
