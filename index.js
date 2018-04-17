const path = require('path');
const config = require('./lib/config');
const _ = require('lodash');
const fs = require('fs-extra');
const yargonaut = require('yargonaut')
  .style('blue')
  .helpStyle('green')
  .errorsStyle('red');

var figlet = yargonaut.figlet();
var chalk = yargonaut.chalk();

_.mixin(require('lodash-deep'));

//-----------------------------------------------------------
// Find the path of the platform

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

//-----------------------------------------------------------


global.requireMain = function(pathModule) {
  return require(path.join(global.pathPlatform, 'main', pathModule));
};
global.requireServices = function(pathModule) {
  return require(path.join(global.pathPlatform, 'services', pathModule));
};

//-----------------------------------------------------------

console.log();
console.log(chalk.bold.blue(figlet.textSync('Agneta', {
  font: 'Cyberlarge'
})));

var configProject = require(path.join(process.cwd(), 'package.json'));
var versionCLI = require(path.join(__dirname, 'package.json')).version;
var versionPlatform = require(path.join(global.pathPlatform, 'package.json')).version;
var versionProject = configProject.version;

console.log(`${chalk.bold.blue('CLI')}: ${versionCLI} - ${__dirname}`);
console.log(`${chalk.bold.blue('Platform')}: ${versionPlatform} - ${global.pathPlatform}`);
console.log(`${chalk.bold.blue('Project')}: ${versionProject}\n\n`);

//-----------------------------------------------------------

Promise.resolve()
  .then(function() {
    return require('./commands')();
  })
  .catch(function(err) {
    console.error(chalk.bold.red(err.message));
    console.error(err.stack);
    process.exit();
  });
