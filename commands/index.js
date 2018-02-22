var yargs = require('yargs');

module.exports = function(){


  require('./default')(yargs);
  require('./config')(yargs);
  require('./version')(yargs);
  require('./image')(yargs);
  require('./generate')(yargs);
  require('./project')(yargs);
  require('./secret')(yargs);

  yargs
    .help('h')
    .alias('h', 'help')
    .argv;

};
