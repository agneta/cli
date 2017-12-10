const Promise = require('bluebird');

module.exports = function() {

  const terminal = global.requireMain('server/terminal');

  var generators = ['dependencies', 'services'];

  return terminal()
    .then(function(servers) {
      return Promise.each(generators, function(generator) {
        return require(`../../generate/${generator}`)(servers);
      });
    });

};
