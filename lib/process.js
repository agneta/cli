const child_process = require('child_process');
const chalk = require('chalk');
const Promise = require('bluebird');


var Main = {};

Main.spawn = function(line, options) {

  console.log();
  console.log(chalk.bold.blue(line + ':'));
  console.log();

  options = options || {};

  return new Promise(function(resolve, reject) {

    //console.log(cmd);

    line = line.split(' ');
    var cmd = line[0];
    var args = line.splice(1);

    var child = child_process.spawn(cmd, args);

    if (!options.silent) {
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }

    var killChild = function() {
      console.warn(`Killing child process ${child.pid}`);
      child.kill();
    };

    process.on('exit', killChild);

    child.on('exit', function() {
      resolve();
      process.removeListener('exit', killChild);
    });

    child.stdout.on('data', function(data) {

      if (data.indexOf('Unhandled rejection') >= 0) {
        killChild();
        reject('Spawn error message identified');
      }

    });

    child.on('error', function(err) {
      killChild();
      reject(err);
    });

    child.on('disconnect', function() {
      //console.log('Child process disconnected');
      resolve();
    });

    child.on('close', function() {
      resolve();
    });

  });
};

Main.exec = function(cmd) {

  console.log();
  console.log(chalk.bold.blue(cmd + ':'));
  console.log();

  return new Promise(function(resolve) {

    //console.log(cmd);

    var child = child_process.exec(cmd, null);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    var killChild = function() {
      console.warn(`Killing child process ${child.pid}`);
      child.kill();
    };

    process.on('exit', killChild);

    child.on('exit', function() {
      process.removeListener('exit', killChild);
    });

    child.on('close', function() {
      resolve();
    });

  });
};

module.exports = Main;
