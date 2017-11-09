const path = require('path');
const config = require('../../lib/config');
const os = require('os');

var user = os.userInfo();
user.username = 'agneta';

var home = `/home/${user.username}`;
var pathCache = '.cache';


var data = {
  name: config.name,
  domain: {
    portal:`${config.name}.portal.localhost`,
    services:`${config.name}.services.localhost`
  },
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
  portHttp: {
    portal: 8081,
    services: 9091
  },
  port: {
    portal: 8082,
    services: 9092
  },
  commands: {}
};

data.path.projectPlatform = path.join(data.path.projectCli, '../platform');


module.exports = data;
