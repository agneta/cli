const fs = require('fs-extra');
const path = require('path');

module.exports = function() {

  var pathProxy = path.join(process.cwd(), '.proxy');

  return fs.copy(path.join(__dirname, 'config.nginx'), path.join(pathProxy, 'subdomains.conf'))
    .then(function() {
      return fs.copy(path.join(__dirname, 'dockerfile'), path.join(pathProxy, 'dockerfile'));
    });
};
