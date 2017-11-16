var path = require('path');
var yargs = require('yargs');

var yargonaut = require('yargonaut')
  .style('blue')
  .helpStyle('green')
  .errorsStyle('red');

var figlet = yargonaut.figlet();
var chalk = yargonaut.chalk();

//-----------------------------------------------------------

global.pathPlatform = path.join(process.cwd(), 'node_modules', 'agneta-platform');
global.requireMain = function(pathModule) {
  return require(path.join(global.pathPlatform,'main', pathModule));
};
global.requireServices = function(pathModule) {
  return require(path.join(global.pathPlatform,'services', pathModule));
};

//-----------------------------------------------------------

console.log();
console.log(chalk.bold.blue(figlet.textSync('Agneta', {
  font: 'Cyberlarge'
})));
var version = require(path.join(__dirname,'package.json')).version;

console.log(`${chalk.bold.blue('CLI')} v.${version}\n\n`);


//-----------------------------------------------------------

require('./commands/default')(yargs);
require('./commands/config')(yargs);
require('./commands/version')(yargs);
require('./commands/image')(yargs);
require('./commands/process')(yargs);
require('./commands/generate')(yargs);
require('./commands/secrets')(yargs);

yargs
  .help('h')
  .alias('h', 'help')
  .argv;
