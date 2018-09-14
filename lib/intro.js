const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const yargonaut = require('yargonaut')
  .style('cyan')
  .style('yellow', 'required')
  .helpStyle('green.underline')
  .errorsStyle('red');

var figlet = yargonaut.figlet();

module.exports = function() {
  console.log();
  console.log(
    chalk.bold.cyan(
      figlet.textSync('Agneta', {
        font: 'Cyberlarge'
      })
    )
  );

  var pathCLI = path.join(__dirname, '../package.json');
  if (fs.existsSync(pathCLI)) {
    let versionCLI = require(pathCLI).version;
    log('CLI', `${versionCLI} - ${__dirname}`);
  }

  if (global.pathPlatform) {
    var pathPlatform = path.join(global.pathPlatform, 'package.json');
    if (fs.existsSync(pathPlatform)) {
      let versionPlatform = require(pathPlatform).version;
      log('Platform', `${versionPlatform} - ${global.pathPlatform}`);
    }
  }

  var pathConfig = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pathConfig)) {
    let configProject = require(pathConfig);
    log('Project', configProject.version);
  }

  function log(label, value) {
    console.log(`${chalk.bold.cyan(label)}: ${value}`);
  }

  console.log();
};
