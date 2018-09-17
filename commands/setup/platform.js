const fs = require('fs-extra');
const path = require('path');
const config = require('../../lib/config');

module.exports = function() {
  var targetPath = path.join(process.cwd(), 'node_modules', '@agneta/platform');
  var sourcePath = config.agneta.get('platform');

  return Promise.resolve()
    .then(function() {
      return fs.exists(targetPath);
    })
    .then(function(exists) {
      if (!exists) {
        return fs.ensureSymlink(sourcePath, targetPath);
      }
    });
};
