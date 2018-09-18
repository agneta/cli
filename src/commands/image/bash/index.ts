import Docker = require('dockerode');
const ContainerSelect = require('../container-select');
module.exports = function() {
  var docker = new Docker();

  let containerSelect = ContainerSelect(docker);
  containerSelect().then(function(container: Docker.Container) {
    var options = {
      Cmd: ['/bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true
    };

    container.exec(options, function(err, exec) {
      exec.start({ stdin: true }, function(err, stream) {
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        process.stdin.pipe(stream);
      });
    });
  });
};
