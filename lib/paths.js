const path = require('path');
const config = require('./config');
const fs = require('fs-extra');

module.exports = function(){

  let pathPlatform = config.project.get('platform');

  if(!pathPlatform){
    pathPlatform = path.join(process.cwd(), 'node_modules', 'agneta-platform');
    if(!fs.existsSync(
      path.join(pathPlatform,'package.json')
    )){
      pathPlatform = null;
    }
  }

  if(!pathPlatform){
    pathPlatform = config.agneta.get('platform');
  }
  global.pathPlatform = pathPlatform;

  global.requireMain = function(pathModule) {
    return require(path.join(global.pathPlatform, 'main', pathModule));
  };
  global.requireServices = function(pathModule) {
    return require(path.join(global.pathPlatform, 'services', pathModule));
  };

};
