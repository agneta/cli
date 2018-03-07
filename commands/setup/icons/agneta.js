const path = require('path');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));

var base = 'source';

module.exports = {
  module: 'agneta-icons',
  dir: 'agneta',
  search: function(options) {
    return function(item) {
      if(item!=base){
        return;
      }
      var svgDir = path.join(options.searchDir, base);

      return glob('**/*.svg', {
        cwd: svgDir,
        nodir: true,
        nosort: true,
        stat: false
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
