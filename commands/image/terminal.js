
const Promise = require('bluebird');
const { spawn } = require('child_process');

module.exports = function(argv) {
  var args = ['exec', argv.service, 'bash', '-c'];

  var commands = {
    bash: 'exec /bin/bash -i',
    error: 'tail -n 1000 -f ~/.pm2/logs/agneta-error-0.log',
    output: 'tail -n 1000 -f ~/.pm2/logs/agneta-output-0.log'
  };

  return Promise.resolve()
    .then(function() {

      var command = commands[argv.command];

      if(!command){
        return Promise.reject(`Command '${argv.command}' is not recognized`);
      }

      args.push(`${command}; bash`);
      spawn('docker-compose', args, { stdio: 'inherit' });

    });

};
