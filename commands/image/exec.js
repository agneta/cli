
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
    return exec(argv,'agneta process output');
  },
  error: function(argv){
    return exec(argv, 'agneta process error');
  },
  terminal: function(argv){
    return exec(argv, 'exec /bin/bash -i');
  },
};
