import Docker = require('dockerode');
const ContainerSelect = require('../container-select');
module.exports = function() {
  var docker = new Docker();

  let containerSelect = ContainerSelect(docker);
  containerSelect().then(function(container: Docker.Container) {
    runExec(container, 'output');
    runExec(container, 'errors');
  });

  function runExec(container: Docker.Container, type: string) {
    var options = {
      Cmd: ['bash', '-c', `agneta ${type}`],
      AttachStdout: true,
      AttachStderr: true
    };

    container.exec(options, function(err: any, exec: any) {
      if (err) return;
      exec.start(function(err: any, stream: any) {
        if (err) return;

        container.modem.demuxStream(stream, process.stdout, process.stderr);

        exec.inspect(function(err: any, data: any) {
          if (err) return;
          console.log(data);
        });
      });
    });
  }
};
