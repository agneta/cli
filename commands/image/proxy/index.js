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

      console.log('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function(data) {
        console.log('[spawn] stdout: ', data.toString());
      });
      childProcess.stderr.on('data', function(data) {
        console.log('[spawn] stderr: ', data.toString());
      });

      return promise;
    })
    .catch(function(err) {
      console.error(err);
      process.exit();
    });

};
