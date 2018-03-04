/*   Copyright 2017 Agneta Network Applications, LLC.
 *
 *   Source file: main/icons.js
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
const path = require('path');
const fs = require('fs-extra');
const ProgressBar = require('progress');
const Promise = require('bluebird');
const chalk = require('chalk');
const glob = Promise.promisify(require('glob'));

module.exports = function(options) {

  var icons = {};

  console.log();
  console.log('-----------------------------------');
  console.log(chalk.blue('Searching for Icons...'));

  return fs.readdir(options.searchDir)
    .then(function(files) {

      var result = [];

      return Promise.map(files, function(file) {

        var base = path.join(file, 'svg', 'production');
        var svgDir = path.join(options.searchDir, base);

        return fs.lstat(svgDir)
          .then(function() {
            return glob('**/*_24px.svg', {
              cwd: svgDir,
              nodir: true,
              nosort: true,
              stat: false
            });
          })
          .then(function(found) {
            result.push({
              base: base,
              files: found
            });
          })
          .catch(function() {

          });
      })
        .then(function() {
          return result;
        });
    })
    .then(function(result) {

      var names = [];

      return Promise.map(result, function(dir) {
        return Promise.map(dir.files, function(file) {
          var parsed = path.parse(file);
          var name = parsed.name;
          name = name.split('_');
          name.pop();
          name.shift();
          name = name.join('_');

          icons[name] = path.join(dir.base, file);
          names.push(name);
        });
      })
        .then(function(){
          return names;
        });
    })
    .then(function(names) {

      var bar = new ProgressBar('[:bar] :percent', {
        total: names.length
      });

      return Promise.map(names, function(name) {

        var sourcePath = path.join(options.searchDir, icons[name]);
        var destPath = path.join(
          options.destDir, name
        );
        var uploadOptions = {
          source: sourcePath,
          location: destPath
        };
        return options
          .servers
          .servicesPortal
          .locals
          .app
          .models.Media
          .__uploadLocalFile(uploadOptions)
          .then(function() {
            bar.tick();
          });

      }, {
        concurrency: 5
      });
    })
    .then(function() {
      console.log(chalk.green('Success: Icons are transfered'));
      console.log('-----------------------------------');
      console.log();
    });
};
