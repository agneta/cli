const path = require('path');
const config = require('./lib/config');
const yargonaut = require('yargonaut')
  .style('blue')
  .helpStyle('green')
  .errorsStyle('red');

var figlet = yargonaut.figlet();
var chalk = yargonaut.chalk();

//-----------------------------------------------------------

global.pathPlatform = config.agneta.get('platform') || path.join(process.cwd(), 'node_modules', 'agneta-platform');
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
var version = require(path.join(__dirname, 'package.json')).version;

console.log(`${chalk.bold.blue('CLI')} v.${version}\n\n`);


//-----------------------------------------------------------

Promise.resolve()
  .then(function() {
    return require('./commands')();
  })
  .catch(function(err){
    console.error(chalk.bold.red(err.message));
    console.error(err.stack);
    process.exit();
  });
