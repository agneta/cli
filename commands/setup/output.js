const klaw = require('klaw');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
const _ = require('lodash');
const inquirer = require('inquirer');
const slugify = require('slugify');

module.exports = function(options) {
  var sourceDir = path.join(__dirname, '../template');
  var projectDir = process.cwd();
  var projectName;

  var templateData = {
    config: options.config
  };
  return Promise.resolve()
    .then(function() {
      if (!options.argv.location) {
        return;
      }

      projectDir = path.join(process.cwd(), options.argv.location);
      projectName = path.parse(projectDir).name;
    })
    .then(function() {
      if (projectName) {
        return;
      }

      return inquirer
        .prompt([
          {
            type: 'text',
            name: 'name',
            message: 'What is the name of your project?'
          }
        ])
        .then(function(answers) {
          projectName = answers.name;
          projectDir = path.join(process.cwd(), answers.name);
        });
    })
    .then(function() {
      templateData.package = {
        name: slugify(projectName)
      };

      return fs.ensureDir(projectDir);
    })
    .then(function() {
      process.chdir(projectDir);

      return new Promise(function(resolve, reject) {
        var walker = klaw(sourceDir);
        var promises = [];

        walker.on('data', function(item) {
          var promise = Promise.resolve().then(function() {
            var location = path.relative(sourceDir, item.path);
            var locationTarget = path.join(projectDir, location);

            if (item.stats.isDirectory()) {
              return fs.ensureDir(locationTarget);
            }

            if (item.stats.isFile()) {
              //console.log(location);

              if (options.config.templates[location]) {
                return fs.readFile(item.path).then(function(content) {
                  content = _.template(content)(templateData);
                  return fs.outputFile(locationTarget, content);
                });
              }

              return fs.exists(locationTarget).then(function(exists) {
                if (exists) {
                  return;
                }
                return fs.copy(item.path, locationTarget);
              });
            }
          });

          promises.push(promise);
        });

        walker.on('end', function() {
          Promise.all(promises)
            .then(resolve)
            .catch(reject);
        });
      });
    });
};
