const path = require('path');
const config = require('./config');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = function() {
  let paths = [
    config.app.platform,
    config.project.get('platform'),
    config.agneta.get('platform'),
    path.join(process.cwd(), 'node_modules', '@agneta/platform')
  ];
  var pathPlatform;

  for (var pathCheck of paths) {
    if (!pathCheck) {
      continue;
    }
    if (pathCheck[0] == '.') {
      pathCheck = path.join(process.cwd(), pathCheck);
    }
    if (!fs.existsSync(path.join(pathCheck, 'package.json'))) {
      console.warn(
        chalk.red(`Could not find package.json of platform path: ${pathCheck}`)
      );
    } else {
      pathPlatform = pathCheck;
      break;
    }
  }

  if (pathPlatform) {
    global.pathPlatform = pathPlatform;

    var distFolder;
    distFolder = path.join(pathPlatform, 'dist');
    if (!fs.existsSync(distFolder)) {
      distFolder = pathPlatform;
    }

    global.requireMain = function(pathModule) {
      return require(path.join(distFolder, 'main', pathModule));
    };
    global.requireServices = function(pathModule) {
      return require(path.join(distFolder, 'services', pathModule));
    };
  } else {
    console.warn(chalk.red('Agneta Platform not found'));
  }

  global.srcPath = function(srcPath) {
    return path.join(__dirname, '../../src', srcPath);
  };
};
