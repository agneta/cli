const Promise = require('bluebird');
const exec = require('child-process-promise').exec;
const _ = require('lodash');
const S = require('string');

module.exports = function() {

  var images = {};
  var names = ['portal_dev','live_dev','portal_stg'];

  return Promise.resolve()
    .then(function() {
      return exec('docker-compose ps');
    })
    .then(function(child) {
      var stdout = child.stdout;
      stdout = stdout.split('\n');
      stdout.shift();
      stdout.shift();
      return Promise.map(stdout, function(line) {
        if (!line) {
          return;
        }
        while (line.indexOf('   ') >= 0) {
          line = line.replace('   ', '  ');
        }
        line = line.split('  ');

        line = _.zipObject(['name', 'command', 'state', 'ports'], line);

        if (line.state != 'Up') {
          return;
        }

        var ports = line.ports.split(',');
        ports.map(function(port){
          port = S(port).trim().s;
          if(port.indexOf('9')===0){
            line.port = port.split('/')[0];
          }
        });

        names.map(function(name) {

          var image = images[name] = images[name] || [];
          if (line.name.indexOf(name) >= 0) {
            image.push({
              name: name,
              port: line.port
            });
          }

        });

      });
    })
    .then(function() {
      return images;
    });

};
