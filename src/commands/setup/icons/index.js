const extract = require('./extract');
const path = require('path');
const Promise = require('bluebird');
const spawn = require('child-process-promise').spawn;
const _ = require('lodash');
const inquirer = require('inquirer');

module.exports = function(_options) {

  var packages = [
    require('./agneta'),
    require('./material')
  ];

  return Promise.resolve()
    .then(function() {

      return inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Download and deploy media assets?'
      }])
        .then(function(answers) {
          if(!answers.confirm){
            return;
          }
          return init();
        });
    });

  function init() {
    return Promise.map(packages,function(pkg){

      var searchDir = null;

      try {
        searchDir = getModulePath();
      } catch(e) {
        console.error(e.message);
      }

      return Promise.resolve()
        .then(function() {

          if(searchDir){
            return;
          }

          console.log(`Intalling ${pkg.module}...`);
          var promise = spawn('npm',['install',pkg.module]);
          var childProcess = promise.childProcess;

          childProcess.stdout.pipe(process.stdout);
          childProcess.stderr.pipe(process.stderr);

          return promise
            .then(function() {
              searchDir = getModulePath();
            });

        })
        .then(function() {

          var options = _.extend({
            searchDir: path.parse(searchDir).dir ,
            destDir: path.join('icons',pkg.dir),
          },_options,pkg);

          return extract(options);
        });

      function getModulePath() {
        return require.resolve(pkg.module,{
          paths: [path.join(process.cwd(),'node_modules')]
            .concat(module.paths)
        });
      }
    },{
      concurrency: 1
    });

  }

};
