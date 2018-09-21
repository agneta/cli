import Docker = require('dockerode');
const config = require('../config');

module.exports = function(yargs) {
  yargs.command('dev', 'Development', function() {
    run(['NODE_ENV=development']);
  });

  yargs.command('prd', 'Production', function() {
    run(['NODE_ENV=production', 'MODE=live', 'GIT_BRANCH=live-production']);
  });

  require('../../default')(yargs);

  function run(env: string[]) {
    var docker = new Docker();
    console.log('starting...');

    docker.run(config.image.app, null, process.stdout, {
      ExposedPorts: {
        '8383/tcp': {}
      },
      Env: env,
      HostConfig: {
        PortBindings: {
          '8383/tcp': [{ HostPort: '8383' }]
        }
      }
    });
  }
};
