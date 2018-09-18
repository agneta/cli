import Docker = require('dockerode');
const config = require('../config');

module.exports = function() {
  var docker = new Docker();
  console.log('starting...');

  docker.run(config.image.app, null, process.stdout, {
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
