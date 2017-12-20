const config = require('./config');
const exec = require('child-process-promise').exec;

module.exports = function() {

  if(!config.machine){
    return;
  }
  return Promise.resolve()
    .then(function() {
      return exec(`docker-machine env ${config.machine.name}`);
    })
    .then(function(result) {
      result = result.stdout.split('#')[0].split('\n');
      result.pop();

      result.map(function(line) {
        line = line.split(' ')[1];
        line = line.split('="');

        var key = line[0];
        var value = line[1].split('"')[0];

        process.env[key]=value;
      });

    });
};
