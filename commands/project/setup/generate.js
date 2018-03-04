const Promise = require('bluebird');

module.exports = function(options) {

  var generators = ['dependencies', 'services'];

  return Promise.each(generators, function(generator) {
    return require(`../../image/setup/${generator}`)(options.servers);
  });

};
