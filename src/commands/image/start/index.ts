import Docker = require('dockerode');

module.exports = function() {
  var docker = new Docker();
  console.log('starting...');

  docker.run('evolvingcycles_web:latest', null, process.stdout, {
    ExposedPorts: {
      '8383/tcp': {}
    },
    HostConfig: {
      PortBindings: {
        '8383/tcp': [{ HostPort: '8383' }]
      }
    }
  });
};
