const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const yargonaut = require('yargonaut')
  .style('cyan')
  .style('yellow', 'required')
  .helpStyle('green.underline')
  .errorsStyle('red');

var figlet = yargonaut.figlet();

module.exports = {
  cli: function() {
    console.log();
    console.log(
      chalk.bold.cyan(
        figlet.textSync('Agneta', {
          font: 'Cyberlarge'
        })
      )
    );

    log('CLI', path.join(__dirname, '../..'));
  },
  project: function() {
    if (global.pathPlatform) {
      var projectPaths = global.requireMain('paths');

      log('Platform', global.pathPlatform);
      log('Portal', projectPaths.portal.base);
      log('Frontend', projectPaths.app.frontend.base);
    }

    log('Project', process.cwd());

    console.log();
  }
};

function log(label, dir) {
  var pathPackage = path.join(dir, 'package.json');
  if (fs.existsSync(pathPackage)) {
    let version = require(pathPackage).version;
    console.log(`${chalk.bold.cyan(label)}: ${version} - ${dir}`);
  }
}
