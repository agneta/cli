const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

module.exports = function(argv) {

  var composeData = {
    config: config
  };
  var templateOptions = {
    interpolate: /<%-([\s\S]+?)%>/g
  };

  require('./commands')(argv);

  return Promise.resolve()

    //-------------------------------------------------------------------
    // Generate dockerfile
    .then(function() {

      return fs.readFile(
        path.join(__dirname, 'dockerfile')
      );

    })
    .then(function(content) {

      var template = _.template(content, templateOptions);
      var contentOutput = template({
        config: config
      }, templateOptions);

      var pathOuput = path.join(
        process.cwd(),
        config.image.file
      );

      return fs.outputFile(pathOuput, contentOutput);

    })
    .then(function() {
      console.log('Generated build file');
    })
    //---------------------------------------------------------------
    // Generate compose file
    .then(function() {

      return fs.readFile(
        path.join(__dirname, 'compose.yml')
      );

    })
    .then(function(content) {

      var template = _.template(content, templateOptions);
      var contentOutput = template(composeData, templateOptions);

      var pathOuput = path.join(
        process.cwd(),
        'docker-compose.yml'
      );

      return fs.outputFile(pathOuput, contentOutput);

    })
    .then(function() {
      console.log('Generated compose file');
    })
    //---------------------------------------------------------------
    // Generate Docker Ignore file
    .then(function() {

      return fs.readFile(
        path.join(
          process.cwd(),
          '.gitignore'
        )
      );

    })
    .then(function(content) {

      var lines = ['/.cache/','.agneta'];

      for (var line of lines) {

        if (content.indexOf(line) < 0) {
          throw new Error(`Your .gitignore should have this line: ${line}`);
        }
        content = content.toString().replace(line, '');
      }

      var pathOuput = path.join(
        process.cwd(),
        '.dockerignore'
      );

      return fs.outputFile(pathOuput, content);

    })
    //---------------------------------------------------------------
    // Generate Docker Ignore file
    .then(function() {

      return fs.copy(
        path.join(
          __dirname,
          'buildspec.yml'
        ),
        path.join(
          process.cwd(),
          'buildspec.yml'
        )
      );

    });


};
