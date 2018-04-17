var util = require('util');

module.exports = function(options) {

  return function(){

    console.log(
      util.inspect(options.config.all, {
        colors: true
      })
    );

  };

};
