const packageJson = require('package-json');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function() {
  var config = {
    templates: {
      'package.json': true,
      'bower.json': true
    },
    name: 'agneta-project'
  };
  return Promise.resolve()
    .then(function() {
      return packageJson('@agneta/platform');
    })
    .then(function(json) {
      config.platform = _.pick(json, ['name', 'version']);
      return config;
    });
};
