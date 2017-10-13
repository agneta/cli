/*   Copyright 2017 Agneta Network Applications, LLC.
 *
 *   Source file: portal/services/boot/git/init.js
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
const simplegit = require('simple-git/promise');
const fs = require('fs-extra');
const Promise = require('bluebird');
const path = require('path');
const _ = require('lodash');
const config = require('./config');

module.exports = function() {

  var base_dir = process.cwd();

  var git = {
    name: '.git',
    native: simplegit(base_dir)
  };

  var repoPath = path.join(base_dir, git.name);
  var initiated;

  git.native.outputHandler(function(command, stdout, stderr) {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  });

  return Promise.resolve()
    .then(function() {
      if (!fs.existsSync(repoPath)) {
        return git.native.init(repoPath, 0)
          .then(function() {
            return true;
          });
      }
    })
    .then(function(_initiated) {

      initiated = _initiated;
      return git.native.getRemotes();

    })
    .then(function(remotes) {

      git.remotes = remotes;

      var foundRemote = _.find(remotes, {
        name: config.remote.name
      });

      if (!foundRemote) {
        return git.native.addRemote(config.remote.name, config.remote.url)
          .then(function() {
            return git.native.getRemotes();
          })
          .then(function(remotes) {
            git.remotes = remotes;
          });
      }

    })
    .then(function() {

      console.log('remotes', git.remotes);

      return git.native.branch();
    })
    .then(function(result) {

      console.log('branch', result);
      git.branch = result;

      return {
        initiated: initiated
      };

    })
    .then(function(result) {
      if (!result.initiated) {
        return;
      }

      return git.native.checkoutLocalBranch(config.branch)
        .then(function() {
          console.log(`Fetching from remote ${config.remote.name} with branch ${config.branch}`);
          return git.native.fetch(config.remote.name, config.branch);
        })
        .then(function() {
          return git.native.reset(['--hard', 'FETCH_HEAD']);
        })
        .then(function() {
          return git.native.clean('f',['-d']);
        });

    })
    .then(function() {

      console.log('Git repository is ready');
      console.log('Current branch is', git.branch.current);

    });


};
