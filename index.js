var path = require('path');
var yargs = require('yargs');

var yargonaut = require('yargonaut')
    .style('blue')
    .helpStyle('green')
    .errorsStyle('red');

var figlet = yargonaut.figlet();
var chalk = yargonaut.chalk();

//-----------------------------------------------------------

global.pathMain = path.join(process.cwd(), 'node_modules', 'agneta-platform', 'main');
global.requireMain = function(pathModule) {
  return require(path.join(global.pathMain, pathModule));
};

//-----------------------------------------------------------

console.log();
console.log(chalk.bold.blue(figlet.textSync('Agneta', {
  font: 'Cyberlarge'
})));

//-----------------------------------------------------------

require('./commands/version')(yargs);
require('./commands/image')(yargs);
require('./commands/process')(yargs);
require('./commands/generate')(yargs);
require('./commands/start')(yargs);

yargs
    .help('h')
    .alias('h', 'help')
    .fail(function(message, error) {
      console.error(chalk.red(error.stack));
    });

var argv = yargs.argv;
var command = argv && argv._[0];
