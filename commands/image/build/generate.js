const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

module.exports = function(argv) {

  var mode = argv.m || 'test';
  var pathCLI = path.join(__dirname, '../../..');
  var buildData = {};
  var composeData = {};

  //-------------------------------------------------------------------
  // Set Template Data

  switch (mode) {
    case 'test':

      console.log(`cli path to copy is ${pathCLI}`);
      buildData.cli = `COPY ${pathCLI} /usr/local/lib/node_modules`;

      break;

    default:

      buildData.cli = 'RUN npm install --global agneta-cli --prefer-offline';

      break;
  }

  composeData.platformPath = path.join(pathCLI,'../platform');

  //-------------------------------------------------------------------

  return Promise.resolve()
    .then(function() {

      return fs.readFile(
        path.join(__dirname, 'dockerfile')
      );

    })
    .then(function(content) {

      var template = _.template(content);
      var contentOutput = template(buildData);

      var pathOuput = path.join(
        process.cwd(),
        'dockerfile'
      );

      return fs.writeFile(pathOuput,contentOutput);

    })
    //---------------------------------------------------------------
    // Generate compose file
    .then(function() {
      console.log('Generated build file');

      return fs.readFile(
        path.join(__dirname, 'compose.yml')
      );

    })
    .then(function(content) {

      var template = _.template(content);
      var contentOutput = template(composeData);

      var pathOuput = path.join(
        process.cwd(),
        'docker-compose.yml'
      );

      return fs.writeFile(pathOuput,contentOutput);

    })
    .then(function() {
      console.log('Generated compose file');
    });
};
