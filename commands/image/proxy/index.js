var spawn = require('child-process-promise').spawn;

module.exports = function() {

  Promise.resolve()
    .then(function() {
      return require('./containers')();
    })
    .then(function(images) {
      return require('./output')({
        images: images
      });
    })
    .then(function() {

      var promise = spawn('docker-compose', ['up','proxy']);
      var childProcess = promise.childProcess;

      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      return promise;
    })
    .catch(function(err) {
      console.error(err);
      process.exit();
    });

};
