const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const proc = require('../../../lib/process');
const config = require('./config');

module.exports = function(argv) {

  var mode = argv.m || 'test';
  var pathCLI = path.join(__dirname, '../../..');
  var buildData = {
    config: config
  };
  var composeData = {
    config: config
  };

  return Promise.resolve()

    //-------------------------------------------------------------------
    // Set Template Data

    .then(function() {

      return Promise.resolve()
        .then(function() {
          return fs.ensureDir(
            path.join(process.cwd(),config.path.cache)
          );
        })
        .then(function() {


          switch (mode) {
            case 'test':

              var pathOutputAbs = path.join(
                process.cwd(),
                config.path.cliCache
              );

              return proc.spawn(`tar cvzf ${pathOutputAbs} --exclude=.git -C ${pathCLI} .`)
                .then(function() {
                  console.log(`cli path to copy is ${pathCLI}`);
                  var target = '/usr/local/lib/node_modules/agneta-cli';
                  buildData.cli = [
                    `ADD ${config.path.cliCache} ${target}`,
                    `RUN ln -s ${target}/bin/agneta /usr/local/bin/agneta`
                  ].join('\n');
                });

            default:

              buildData.cli = 'RUN npm install --global agneta-cli --prefer-offline';

              break;
          }

        })
        .then(function() {

          composeData.platformPath = path.join(pathCLI, '../platform');
          composeData.cliPath = pathCLI;

        });

    })
    //-------------------------------------------------------------------
    // Generate dockerfile
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

      var template = _.template(content);
      var contentOutput = template(composeData);

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

      var line = '/.cache/';

      if (content.indexOf(line) < 0) {
        throw new Error(`Your .gitignore should have this line: ${line}`);
      }
      var contentOutput = content.toString().replace(line, '');

      var pathOuput = path.join(
        process.cwd(),
        '.dockerignore'
      );

      return fs.outputFile(pathOuput, contentOutput);

    });


};
