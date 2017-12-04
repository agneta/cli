const Promise = require('bluebird');

const terminal = global.requireMain('server/terminal');

module.exports = function() {

  var generators = ['dependencies', 'services'];

  return terminal()
    .then(function(servers) {
      return Promise.each(generators, function(generator) {
        return require(`../../generate/${generator}`)(servers);
      });
    });

};
