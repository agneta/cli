const exec = require('child_process').exec;

var Main = {};

Main.run = function(cmd) {

  return new Promise(function(resolve, reject) {

    //console.log(cmd);

    var child = exec(cmd, null, function(err) {

      if (err) {
        reject(err);
        return;
      }

    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    var killChild = function() {
      console.warn(`Killing child process ${child.pid}`);
      child.kill();
    };

    var result = '';

    child.stdout.on('data', function(data) {
      result += data.toString();
    });

    process.on('exit', killChild);

    child.on('exit', function() {

      resolve(result);

      process.removeListener('exit', killChild);
    });
  });
};

module.exports = Main;
