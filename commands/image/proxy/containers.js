const Promise = require('bluebird');
const exec = require('child-process-promise').exec;
const _ = require('lodash');

module.exports = function() {

  var images = {
    portal: [],
    live: []
  };

  return Promise.resolve()
    .then(function() {
      return exec('docker-compose ps');
    })
    .then(function(child) {
      var stdout = child.stdout;
      stdout = stdout.split('\n');
      stdout.shift();
      stdout.shift();
      return Promise.map(stdout,function(line){
        if(!line){
          return;
        }
        while(line.indexOf('   ')>=0){
          line = line.replace('   ','  ');
        }
        line = line.split('  ');

        line = _.zipObject(['name','command','state','ports'],line);

        if(line.state != 'Up'){
          return;
        }

        if(line.name.indexOf('portal')>=0){
          images.portal.push(line);
        }

        if(line.name.indexOf('live')>=0){
          images.portal.push(line);
        }
      });
    })
    .then(function() {
      return images;
    });

};
