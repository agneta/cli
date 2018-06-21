const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const { spawn } = require('child_process');

module.exports = function(yargs) {
  var argv = yargs;

  var composeData = {
    config: config
  };

  var templateOptions = {
    interpolate: /<%-([\s\S]+?)%>/g
  };

  var baseDir = path.join(config.path.agneta, 'image-base');
  var dockerFilePath = path.join(baseDir, 'dockerfile');

  require('../init/commands')(argv);

  Promise.resolve()

    //-------------------------------------------------------------------
    // Generate dockerfile
    .then(function() {
      return fs.readFile(path.join(__dirname, 'dockerfile'));
    })
    .then(function(content) {
      var template = _.template(content, templateOptions);
      var contentOutput = template(
        {
          config: config
        },
        templateOptions
      );

      return fs.outputFile(dockerFilePath, contentOutput);
    })
    .then(function() {
      console.log('Generated build file');
    })
    //---------------------------------------------------------------
    // Generate compose file
    .then(function() {
      return fs.readFile(path.join(__dirname, 'compose.yml'));
    })
    .then(function(content) {
      var template = _.template(content, templateOptions);
      var contentOutput = template(composeData, templateOptions);

      var pathOuput = path.join(baseDir, 'docker-compose.yml');

      return fs.outputFile(pathOuput, contentOutput);
    })
    .then(function() {
      console.log('Generated compose file');
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
