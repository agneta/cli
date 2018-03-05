const path = require('path');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const fs = require('fs-extra');

module.exports = {
  module: 'material-design-icons',
  dir: 'material',
  fixName: function(name) {
    name = name.split('_');
    name.pop();
    name.shift();
    name = name.join('_');
    return name;
  },
  search: function(options) {
    return function(item) {
      var base = path.join(item, 'svg', 'production');
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
          options.result.push({
            base: base,
            files: found
          });
        })
        .catch(function() {

        });
    };
  }
};
