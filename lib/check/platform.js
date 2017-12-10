const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const config = require('../config');

module.exports = function() {
  return Promise.resolve()
    .then(function() {

      var platform = config.agneta.get('platform');

      if (platform) {
        return checkPlatform();
      }

      return setPlatform();

      function setPlatform() {
        return inquirer.prompt([{
          type: 'text',
          name: 'platform',
          message: 'The platform could not be found. Set the path to the platform'
        }])
          .then(function(answers) {
            platform = answers.platform;
            config.agneta.set('platform', platform);
            return checkPlatform();
          });
      }


      function checkPlatform() {

        var pkgPath = path.join(platform, 'package.json');

        return fs.pathExists(pkgPath)
          .then(function(exists) {
            if(!exists){
              throw new Error(`Could not find the package.json of the platform with path ${pkgPath}`);
            }
            return fs.readJson(pkgPath);
          })
          .then(function(pkg) {
            if(pkg.name!='agneta-platform'){
              throw new Error(`The path (${pkgPath}) seems to not point the agneta platform`);
            }
          })
          .catch(function(error) {
            console.error(error.message);
            console.error('Try again...');
            return setPlatform();
          });

      }

    });

};
