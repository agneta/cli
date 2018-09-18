import Docker = require('dockerode');

module.exports = function() {
  var docker = new Docker();

  docker
    .listContainers({
      filters: {
        ancestor: 'evolvingcycles_web'
      }
    })
    .then(function(containers: [Docker.ContainerInfo]) {
      console.log(containers);
    });

  function runExec(container: Docker.Container) {
    var options = {
      Cmd: ['bash', '-c', 'agneta output'],
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
