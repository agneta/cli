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
var version = require(path.join(__dirname,'package.json')).version;

process.stdout.moveCursor(48,-2);
process.stdout.write(`${chalk.bold.blue('CLI')} v.${version}\n\n`);


//-----------------------------------------------------------


yargs.command('*','Default',function(){
  console.log(chalk.bold.red('Command not found'));
  console.log('Specify --help for available options');
  console.log();
});

require('./commands/version')(yargs);
require('./commands/image')(yargs);
require('./commands/process')(yargs);
require('./commands/generate')(yargs);

yargs
    .help('h')
    .alias('h', 'help')
    .fail(function(message, error) {
      console.error(chalk.red(message));
      if(error){
        console.error(chalk.red(error));
      }
    })
    .argv;
