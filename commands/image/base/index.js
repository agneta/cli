const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

module.exports = function(yargs) {
  var argv = yargs;

  var composeData = {
    config: config,
  };

  var templateOptions = {
    interpolate: /<%-([\s\S]+?)%>/g
  };

  require('../init/commands')(argv);

  Promise.resolve()

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
        'dockerfile'
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
    });
};
