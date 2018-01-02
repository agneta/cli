
const Promise = require('bluebird');
const { spawn } = require('child_process');


function exec(argv, command) {

  var args = ['exec', argv.service, 'bash', '-c'];

  return Promise.resolve()
    .then(function() {
      return require('./machine')();
    })
    .then(function() {

      args.push(`${command}; bash`);
      spawn('docker-compose', args, { stdio: 'inherit' });

    });
}

module.exports =  {
  output: function(argv){
    return exec(argv,'tail -n 1000 -f ~/.pm2/logs/agneta-output-0.log');
  },
  error: function(argv){
    return exec(argv, 'tail -n 1000 -f ~/.pm2/logs/agneta-error-0.log');
  },
  terminal: function(argv){
    return exec(argv, 'exec /bin/bash -i');
  },
};
