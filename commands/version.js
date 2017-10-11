const path = require('path');
module.exports = function(yargs) {

  yargs
    .command('version', 'Get Agneta versions', function() {

      console.log(
        require(path.join(__dirname,'../package.json')).version
      );

    });

};
