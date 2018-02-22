const opener = require('opener');

module.exports = function(options) {

  return function(){

    opener(options.config.path);

  };

};
