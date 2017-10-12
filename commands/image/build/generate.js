const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const proc = require('../../../lib/process');

module.exports = function(argv) {

  var mode = argv.m || 'test';
  var pathCLI = path.join(__dirname, '../../..');
  var buildData = {};
  var composeData = {};

  return Promise.resolve()

    //-------------------------------------------------------------------
    // Set Template Data

    .then(function() {

      return Promise.resolve()
        .then(function() {


          switch (mode) {
            case 'test':

              var pathOutput = '.cache/cli.tgz';
              var pathOutputAbs = path.join(
                process.cwd(),
                pathOutput
              );

              return proc.exec(`tar cvzf ${pathOutputAbs} -C ${pathCLI} . --exclude='./.git'`)
                .then(function() {
                  console.log(`cli path to copy is ${pathCLI}`);
                  buildData.cli = `ADD ${pathOutput} /usr/local/lib/node_modules`;
                });

            default:

              buildData.cli = 'RUN npm install --global agneta-cli --prefer-offline';

              break;
          }

        })
        .then(function() {

          composeData.platformPath = path.join(pathCLI, '../platform');

        });

    })
    //-------------------------------------------------------------------

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

      return fs.writeFile(pathOuput, contentOutput);

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

      var template = _.template(content);
      var contentOutput = template(composeData);

      var pathOuput = path.join(
        process.cwd(),
        'docker-compose.yml'
      );

      return fs.writeFile(pathOuput, contentOutput);

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

      var line = '/.cache/';

      if (content.indexOf(line)<0) {
        throw new Error(`Your .gitignore should have this line: ${line}`);
      }
      console.log(content);
      var contentOutput = content.toString().replace(line, '');

      var pathOuput = path.join(
        process.cwd(),
        '.dockerignore'
      );

      return fs.writeFile(pathOuput, contentOutput);

    });


};
