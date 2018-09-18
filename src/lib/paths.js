const path = require('path');
const config = require('./config');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = function() {
  let paths = [
    config.project.get('platform'),
    config.agneta.get('platform'),
    path.join(process.cwd(), 'node_modules', '@agneta/platform')
  ];

  for (var pathPlatform of paths) {
    if (!pathPlatform) {
      continue;
    }
    if (!fs.existsSync(path.join(pathPlatform, 'package.json'))) {
      console.warn(
        chalk.red(
          `Could not find package.json of platform path: ${pathPlatform}`
        )
      );
    } else {
      break;
    }
  }

  if (!pathPlatform) {
    console.warn(chalk.red('Agneta Platform not found'));
    return;
  }

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
};