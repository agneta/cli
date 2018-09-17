const Docker = require('dockerode');

module.exports = function() {
  var docker = new Docker();
  console.log('starting...');

  docker.run('evolvingcycles_web:latest', null, process.stdout, function(
    err,
    data,
    container
  ) {
    if (err) {
      console.error(err);
    }
    container.attach(
      {
        stream: true,
        stdout: true,
        stderr: true
      },
      function handler(err, stream) {
        if (err) {
          console.error(err);
        }
        //...
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        //...
      }
    );
  });
};
