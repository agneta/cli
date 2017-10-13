module.exports = function(yargs) {

  var argv = yargs
    .option('ip', {
      default: false
    })
    .argv;

  require('./ssh')(argv)
    .then(function() {
      return require('./git')();
    });

};
