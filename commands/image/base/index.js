const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const { spawn } = require('child_process');

module.exports = function(yargs) {
  var argv = yargs;
  var templateOptions = {
    interpolate: /<%-([\s\S]+?)%>/g
  };

  var baseDir = path.join(config.path.agneta, 'image-base');

  require('../init/commands')(argv);

  function outputFile(name) {
    Promise.resolve()
      .then(function() {
        return fs.readFile(path.join(__dirname, name));
      })
      .then(function(content) {
        var template = _.template(content, templateOptions);
        var contentOutput = template(
          {
            config: config
          },
          templateOptions
        );

        return fs.outputFile(path.join(baseDir, name), contentOutput);
      });
  }

  Promise.resolve()
    .then(function() {
      return Promise.map(
        ['dockerfile', 'bootstrap.sh', 'compose.yml'],
        outputFile
      );
    })
    .then(function() {
      var child = spawn(
        'docker',
        ['build', '--tag', config.image.base, baseDir],
        {
          stdio: 'inherit'
        }
      );

      return new Promise(function(resolve, reject) {
        child.on('error', function(err) {
          reject(err);
        });

        child.on('disconnect', function() {
          resolve();
        });

        child.on('close', function() {
          resolve();
        });
      });
    });
};
