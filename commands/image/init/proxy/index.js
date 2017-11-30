const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');
const _ = require('lodash');
module.exports = function() {

  var pathProxy = path.join(process.cwd(), '.proxy');

  return fs.readFile(path.join(__dirname, 'config.cfg'))
    .then(function(content) {

      content = _.template(content)({
        config: config
      });

      return fs.outputFile(path.join(pathProxy, 'config.cfg'),content);
    })
    .then(function() {
      return fs.copy(path.join(__dirname, 'dockerfile'), path.join(pathProxy, 'dockerfile'));
    })
    .then(function(){
      console.log('Generated proxy configuration');
    });
};
