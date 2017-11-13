const fs = require('fs-extra');
const path = require('path');
module.exports = function() {

  var pathProxy = path.join(process.cwd(), '.proxy');

  return fs.copy(path.join(__dirname, 'config.cfg'), path.join(pathProxy, 'config.cfg'))
    .then(function() {
      return fs.copy(path.join(__dirname, 'dockerfile'), path.join(pathProxy, 'dockerfile'));
    });
};
