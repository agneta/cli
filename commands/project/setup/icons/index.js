const extract = require('./extract');
const paths = global.requireMain('paths');
const path = require('path');
const Promise = require('bluebird');
const fs = require('fs-extra');
const spawn = require('child-process-promise').spawn;
const _ = require('lodash');

module.exports = function(_options) {
  var pkgName = 'material-design-icons';
  var options = _.extend({
    searchDir: path.join(paths.core.project,
      'node_modules',
      pkgName
    ),
    destDir: path.join('icons','material')
  },_options);

  return Promise.resolve()
    .then(function() {
      return fs.pathExists(options.searchDir);
    })
    .then(function(exists) {

      if(exists){
        return;
      }
      console.log(`Intalling ${pkgName}...`);
      var promise = spawn('npm',['install',pkgName]);
      var childProcess = promise.childProcess;

      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      return promise;


    })
    .then(function() {
      return extract(options);
    });

};
